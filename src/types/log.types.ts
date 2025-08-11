import { FileType } from './associatedArtifact.types';
import { LanguageString } from './common.types';

export interface LogEntryOrganization {
  type: 'Organization';
  acronym: string;
  labels: LanguageString;
}

export interface LogEntryPerson {
  type: 'Person';
  givenName: string;
  familyName: string;
  onBehalfOf: LogEntryOrganization;
}

interface BaseLogEntry {
  timestamp: string;
}

interface PublicationLogEntry extends BaseLogEntry {
  type: 'PublicationLogEntry';
  topic:
    | 'PublicationCreated'
    | 'PublicationUpdated'
    | 'PublicationPublished'
    | 'PublicationUnpublished'
    | 'PublicationDeleted'
    | 'PublicationRepublished'
    | 'DoiReserved'
    | 'DoiRequested'
    | 'DoiRejected'
    | 'DoiAssigned';
  performedBy: LogEntryPerson;
}

export interface ImportSourceLogData {
  source: string;
  archive?: string;
}

interface PublicationImportLogEntry extends Omit<PublicationLogEntry, 'topic' | 'performedBy'> {
  topic: 'PublicationImported' | 'PublicationMerged';
  performedBy: LogEntryOrganization;
  importSource: ImportSourceLogData;
}

interface FileLogEntry extends BaseLogEntry {
  type: 'FileLogEntry';
  topic:
    | 'FileUploaded'
    | 'FileApproved'
    | 'FileRejected'
    | 'FileDeleted'
    | 'FileRetracted'
    | 'FileHidden'
    | 'FileTypeUpdated'
    | 'FileTypeUpdatedByImport';
  performedBy: LogEntryPerson;
  filename: string;
  fileType: FileType;
  fileIdentifier: string;
}

interface FileImportLogEntry extends Omit<FileLogEntry, 'topic'> {
  topic: 'FileImported';
  importSource: ImportSourceLogData;
}

export type LogEntry = PublicationLogEntry | FileLogEntry | PublicationImportLogEntry | FileImportLogEntry;

export interface RegistrationLogResponse {
  logEntries: LogEntry[];
}
