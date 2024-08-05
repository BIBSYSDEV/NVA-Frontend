import { TicketType } from './publication_types/ticket.types';

export interface Log {
  entries: LogEntry[];
  metadataUpdated: string;
  numberOfArchivedFiles: number;
}

export interface LogEntry {
  type: TicketType | 'Import' | 'Created' | 'MetadataPublished';
  title: string;
  modifiedDate: string;
  actions: LogAction[];
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
