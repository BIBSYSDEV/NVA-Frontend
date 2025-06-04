import { AssociatedFile } from '../associatedArtifact.types';
import { AggregationValue, SearchResponse2 } from '../common.types';
import { PublishStrategy } from '../customerInstitution.types';
import { BaseEntityDescription, PublicationInstanceType, Registration } from '../registration.types';

interface BaseMessage {
  id: string;
  identifier: string;
  text: string;
  createdDate: string;
}

export interface Message extends BaseMessage {
  sender: string;
}

interface ExpandedMessage extends BaseMessage {
  sender: Person;
}

export interface TicketCollection {
  type: 'TicketCollection';
  tickets: Ticket[];
}

export type TicketType =
  | 'DoiRequest'
  | 'GeneralSupportCase'
  | 'PublishingRequest'
  | 'FilesApprovalThesis'
  | 'UnpublishRequest';
export type TicketStatus = 'New' | 'Pending' | 'Closed' | 'Completed' | 'NotApplicable';
export const ticketStatusValues: TicketStatus[] = ['New', 'Pending', 'Closed', 'Completed'];

interface BaseTicket {
  type: TicketType;
  status: TicketStatus;
  createdDate: string;
  modifiedDate: string;
  id: string;
  publicationIdentifier: string;
  publication: TicketPublication;
}

export interface Ticket extends BaseTicket {
  assignee?: string;
  owner: string;
  ownerAffiliation: string;
  viewedBy: string[];
  messages: Message[];
  finalizedBy?: string;
  finalizedDate?: string;
  availableInstitutions?: string[];
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

type TicketAllowedOperations = 'approve';

export interface PublishingTicket extends Ticket {
  approvedFiles: AssociatedFile[];
  filesForApproval: AssociatedFile[];
  workflow: PublishStrategy;
  allowedOperations: TicketAllowedOperations[];
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

type CustomerTicketAggregations = {
  type?: AggregationValue<TicketType>[];
  status?: AggregationValue<TicketStatus>[];
  byUserPending?: AggregationValue<TicketType>[];
};

export type CustomerTicketSearchResponse = SearchResponse2<ExpandedTicket, CustomerTicketAggregations>;

export type TicketTypeColor = {
  [key in TicketType]?: string;
};

export type TicketTypeSelection = {
  [key in Uncapitalize<TicketType>]?: boolean;
};
