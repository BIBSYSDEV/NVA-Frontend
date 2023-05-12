import { PublishStrategy } from '../customerInstitution.types';
import { BaseEntityDescription, PublicationInstanceType, Registration } from '../registration.types';
import { JournalPublicationInstance } from './journalRegistration.types';

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
  publication: TicketPublication;
  messages: Message[];
}

type TicketPublication = Pick<
  Registration,
  'id' | 'identifier' | 'status' | 'modifiedDate' | 'createdDate' | 'publishedDate'
> &
  Pick<BaseEntityDescription, 'contributors' | 'mainTitle'> & {
    publicationInstance: { type: PublicationInstanceType };
  };

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
