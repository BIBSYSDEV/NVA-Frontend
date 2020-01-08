import { defaultLanguage } from '../translations/i18n';
import ContributorType from './contributor.types';
import { ReferenceType } from './references.types';
import { Language } from './settings.types';

export interface PublicationFormsData {
  description: DescriptionFormData;
  reference: ReferenceFormData;
  contributors: ContributorsFormData;
}

export interface DescriptionFormData {
  title: string;
  abstract: string;
  description: string;
  npi: string;
  language: Language;
  date?: Date;
  year?: number;
  project: string;
}

interface Publisher {
  issn: string;
  level: string;
  publisher: string;
  title: string;
}

export interface ReferencesFormData {
  publisher: Publisher;
  referenceType: ReferenceType;
}

export interface ContributorsFormData {
  authors: ContributorType[];
  contributors: ContributorType[];
}

export interface BookReferenceFormData {
  type: string;
  publisher: Publisher;
  isbn: string;
  peerReview: boolean;
  textBook: boolean;
  numberOfPages: string;
  series: Publisher;
}

export interface JournalPublicationReferenceFormData {
  type: string;
  doi: string;
  journal: Publisher;
  volume: string;
  issue: string;
  peerReview: boolean;
  pagesFrom: string;
  pagesTo: string;
  articleNumber: string;
}

export interface ReferenceFormData {
  referenceType: string;
  book: BookReferenceFormData;
  journalPublication: JournalPublicationReferenceFormData;
}

export const emptyPublisher: Publisher = {
  issn: '',
  level: '',
  publisher: '',
  title: '',
};

export const emptyDescriptionFormData: DescriptionFormData = {
  title: '',
  abstract: '',
  description: '',
  npi: '',
  language: defaultLanguage,
  date: undefined,
  year: undefined,
  project: '',
};

export const emptyReferencesForm: ReferencesFormData = {
  publisher: emptyPublisher,
  referenceType: ReferenceType.PUBLICATION_IN_JOURNAL,
};

export const emptyContributorsFormData: ContributorsFormData = {
  authors: [],
  contributors: [],
};

export const emptyBookReferenceFormData: BookReferenceFormData = {
  type: '',
  publisher: emptyPublisher,
  isbn: '',
  peerReview: false,
  textBook: false,
  numberOfPages: '',
  series: emptyPublisher,
};

export const emptyJournalPublicationReferenceFormData: JournalPublicationReferenceFormData = {
  type: '',
  doi: '',
  journal: emptyPublisher,
  volume: '',
  issue: '',
  peerReview: false,
  pagesFrom: '',
  pagesTo: '',
  articleNumber: '',
};

export const emptyReferenceFormData: ReferenceFormData = {
  referenceType: '',
  book: emptyBookReferenceFormData,
  journalPublication: emptyJournalPublicationReferenceFormData,
};

export const emptyPublicationFormData: PublicationFormsData = {
  description: emptyDescriptionFormData,
  reference: emptyReferenceFormData,
  contributors: emptyContributorsFormData,
};
