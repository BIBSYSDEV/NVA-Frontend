import { DoiRequest, RegistrationPreview } from '../registration.types';

export enum MessageType {
  DoiRequest = 'DoiRequest',
  Support = 'Support',
}

export interface Message {
  createdDate: string;
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
  type: 'PublicationConversation';
  messageCollections: MessageCollection[];
  publication: RegistrationPreview;
}

export interface DoiRequestConversation extends DoiRequest {
  publication: RegistrationPreview;
}
