import { Message, TicketType } from './publication_types/ticket.types';

export interface Log {
  entries: LogEntry[];
  metadataUpdated: string;
  numberOfArchivedFiles: number;
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
  fileIcon?: 'file' | 'deletedFile' | 'archivedFile' | 'rejectedFile';
}
