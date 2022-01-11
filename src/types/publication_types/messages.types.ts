import { Registration } from '../registration.types';

export enum MessageType {
  DoiRequest = 'DoiRequest',
  Support = 'Support',
}

export interface Message {
  date: string;
  id: string;
  identifier: string;
  owner: string;
  sender: string;
  text: string;
}

export interface MessageCollection {
  messageType: MessageType;
  messages: Message[];
}

export interface PublicationConversation {
  messageCollections: MessageCollection[];
  publication: Registration;
}

interface Hit {
  _source: PublicationConversation;
}

export interface MessagesResponse {
  hits: {
    hits: Hit[];
  };
}
