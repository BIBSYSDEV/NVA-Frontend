import { AssociatedFile } from '../associatedArtifact.types';
import { AggregationValue, SearchResponse, SearchResponse2 } from '../common.types';
import { PublishStrategy } from '../customerInstitution.types';
import { BaseEntityDescription, PublicationInstanceType, Registration } from '../registration.types';

interface BaseMessage {
  id: string;
  identifier: string;
  text: string;
  createdDate: string;
}

interface Message extends BaseMessage {
  sender: string;
}

interface ExpandedMessage extends BaseMessage {
  sender: Person;
}

export interface TicketCollection {
  type: 'TicketCollection';
  tickets: Ticket[];
}

export type TicketType = 'DoiRequest' | 'GeneralSupportCase' | 'PublishingRequest';
export type TicketStatus = 'New' | 'Pending' | 'Closed' | 'Completed' | 'NotApplicable';
export const ticketStatusValues: TicketStatus[] = ['New', 'Pending', 'Closed', 'Completed'];

interface BaseTicket {
  type: TicketType;
  status: TicketStatus;
  createdDate: string;
  modifiedDate: string;
  id: string;
  publication: TicketPublication;
}

export interface Ticket extends BaseTicket {
  assignee?: string;
  owner: string;
  viewedBy: string[];
  messages: Message[];
}

export interface ExpandedTicket extends BaseTicket {
  assignee?: Person;
  owner: Person;
  viewedBy: Person[];
  messages: ExpandedMessage[];
}

type TicketPublication = Pick<
  Registration,
  'id' | 'identifier' | 'status' | 'modifiedDate' | 'createdDate' | 'publishedDate'
> &
  Pick<BaseEntityDescription, 'contributors' | 'mainTitle'> & {
    publicationInstance: { type: PublicationInstanceType };
  };

export interface PublishingTicket extends Ticket {
  approvedFiles: AssociatedFile[];
  filesForApproval: AssociatedFile[];
  workflow: PublishStrategy;
}

export interface ExpandedPublishingTicket extends ExpandedTicket {
  approvedFiles: AssociatedFile[];
  filesForApproval: AssociatedFile[];
  workflow: PublishStrategy;
}

interface Person {
  preferredFirstName?: string;
  firstName: string;
  preferredLastName?: string;
  lastName: string;
  username: string;
}

type TicketAggregations = {
  [fieldName: string]: {
    buckets?: AggregationBucket[];
  };
};

interface AggregationBucket {
  key: string;
  docCount: number;
}

export type TicketSearchResponse = SearchResponse<ExpandedTicket, TicketAggregations>;

type CustomerTicketAggregations = {
  type?: AggregationValue<TicketType>[];
  status?: AggregationValue<TicketStatus>[];
  byUserPending?: AggregationValue<TicketType>[];
};

export type CustomerTicketSearchResponse = SearchResponse2<ExpandedTicket, CustomerTicketAggregations>;
