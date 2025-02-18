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
}

interface PublicationImportedLogEntry extends Omit<PublicationLogEntry, 'topic'> {
  topic: 'PublicationImported';
  source: {
    importSource: {
      archive?: string;
      source: string;
    };
  };
}

interface FileLogEntry extends BaseLogEntry {
  type: 'FileLogEntry';
  topic:
    | 'FileUploaded'
    | 'FileApproved'
    | 'FileRejected'
    | 'FileDeleted'
    | 'FileImported'
    | 'FileRetracted'
    | 'FileHidden';
  filename: string;
  fileType: FileType;
}

export type LogEntryObject = PublicationLogEntry | FileLogEntry | PublicationImportedLogEntry;

export interface RegistrationLogResponse {
  logEntries: LogEntryObject[];
}
