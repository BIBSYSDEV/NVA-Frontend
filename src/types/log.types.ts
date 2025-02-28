import { FileType } from './associatedArtifact.types';
import { Message, TicketType } from './publication_types/ticket.types';

export interface Log {
  entries: LogEntry[];
  metadataUpdated: string;
  numberOfArchivedFiles: number;
  numberOfHiddenFiles: number;
}

export type LogEntryType = TicketType | 'Import' | 'Created' | 'MetadataPublished' | 'Republished' | 'Deleted';

export interface LogEntry {
  type: LogEntryType;
  title: string;
  modifiedDate: string;
  actions: LogAction[];
  messages?: Message[];
}

export interface LogAction {
  actor?: string;
  organization?: string;
  items: LogActionItem[];
}

export interface LogActionItem {
  description: string;
  date?: string;
  fileIcon?: 'file' | 'deletedFile' | 'archivedFile' | 'rejectedFile' | 'hiddenFile';
}

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

export type LogEntryObject = PublicationLogEntry | FileLogEntry | PublicationImportLogEntry | FileImportLogEntry;

export interface RegistrationLogResponse {
  logEntries: LogEntryObject[];
}
