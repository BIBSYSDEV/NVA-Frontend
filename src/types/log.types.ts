import { TicketType } from './publication_types/ticket.types';

export interface Log {
  entries: LogEntry[];
  metadataUpdated: string;
  numberOfArchivedFiles: number;
}

export interface LogEntry {
  type: TicketType | 'import';
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
  date: string;
  icon?: 'file' | 'deletedFile' | 'archivedFile';
}
