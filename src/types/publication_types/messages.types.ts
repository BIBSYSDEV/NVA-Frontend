import { RegistrationPreview } from '../registration.types';

export interface Message {
  id: string;
  identifier: string;
  sender: string;
  owner: string;
  text: string;
  date: string;
  recipient: string;
}

export interface TicketCollection {
  type: 'TicketCollection';
  tickets: Ticket[];
}

export type TicketType = 'DoiRequest' | 'GeneralSupportCase' | 'PublishingRequest';
export type TicketStatus = 'Pending' | 'Closed' | 'Completed';

export interface Ticket {
  type: TicketType;
  status: TicketStatus;
  createdDate: string;
  modifiedDate: string;
  id: string;
  identifier: string;
  publicationSummary?: {
    id: string;
    identifier: string;
    mainTitle: string;
  };
  publication?: RegistrationPreview; // TODO: publication/publicationSummary should be one?
  viewedBy: string[];
  messages: Message[];
}
