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

export type TicketType = 'DoiRequest' | 'GeneralSupportCase' | 'PublishingRequest' | 'GeneralSupportRequest'; // TODO: remove duplicated Support when search and publication api returns same
export type TicketStatus = 'Pending' | 'Closed' | 'Completed';

export interface Ticket {
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
  viewedBy: string[];
  messages: Message[];
}
