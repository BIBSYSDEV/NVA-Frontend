import { RegistrationPreview } from '../registration.types';

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

export interface SupportRequest {
  messageCollections: MessageCollection[];
  publication: RegistrationPreview;
}
