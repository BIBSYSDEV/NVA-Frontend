import { PublishStrategy } from '../customerInstitution.types';

export interface Message {
  id: string;
  identifier: string;
  sender: Person;
  text: string;
  createdDate: string;
  recipient: string;
}

export interface TicketCollection {
  type: 'TicketCollection';
  tickets: Ticket[];
}

export type TicketType = 'DoiRequest' | 'GeneralSupportCase' | 'PublishingRequest';
export type TicketStatus = 'Pending' | 'Closed' | 'Completed';

export interface Ticket {
  owner: Person;
  type: TicketType;
  status: TicketStatus;
  createdDate: string;
  modifiedDate: string;
  id: string;
  identifier: string;
  publication: {
    id: string;
    identifier: string;
    mainTitle: string;
  };
  messages: Message[];
}

export interface PublishingTicket extends Ticket {
  workflow: PublishStrategy;
}

interface Person {
  preferredFirstName?: string;
  firstName: string;
  preferredLastName?: string;
  lastName: string;
  username: string;
}
