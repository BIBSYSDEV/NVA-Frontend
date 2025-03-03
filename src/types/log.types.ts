import { FileType } from './associatedArtifact.types';

interface LogEntryOnBehalfOf {
  id: string;
  shortName: string;
  displayName: string;
}

interface LogEntryPerformedBy {
  givenName: string;
  familyName: string;
  onBehalfOf: LogEntryOnBehalfOf;
}

interface BaseLogEntry {
  timestamp: string;
  performedBy?: LogEntryPerformedBy;
}

interface PublicationLogEntry extends BaseLogEntry {
  type: 'PublicationLogEntry';
  topic:
    | 'PublicationCreated'
    | 'PublicationPublished'
    | 'PublicationUnpublished'
    | 'PublicationDeleted'
    | 'PublicationRepublished'
    | 'DoiReserved'
    | 'DoiRequested'
    | 'DoiRejected'
    | 'DoiAssigned';
  timestamp: string;
}

export interface ImportSourceLogData {
  source: string;
  archive?: string;
}

interface PublicationImportLogEntry extends Omit<PublicationLogEntry, 'topic'> {
  topic: 'PublicationImported' | 'PublicationMerged';
  importSource: ImportSourceLogData;
}

interface FileLogEntry extends BaseLogEntry {
  type: 'FileLogEntry';
  topic: 'FileUploaded' | 'FileApproved' | 'FileRejected' | 'FileDeleted' | 'FileRetracted' | 'FileHidden';
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
