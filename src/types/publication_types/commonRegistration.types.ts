import { RegistrationDate } from '../registration.types';

export interface NviApplicableBase<T> {
  contentType: T | null;
  peerReviewed: boolean | null;
  originalResearch: boolean | null;
}

export const emptyDate: RegistrationDate = {
  type: 'PublicationDate',
  year: '',
  month: '',
  day: '',
};

export interface LanguageString {
  [key: string]: string;
}
