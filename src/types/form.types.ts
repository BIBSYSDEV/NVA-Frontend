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

export interface ReferencesFormData {
  publisher: {
    issn: string;
    level: string;
    publisher: string;
    title: string;
  };
  referenceType: ReferenceType;
}

export interface ContributorsFormData {
  authors: ContributorType[];
  contributors: ContributorType[];
}

export interface BookReferenceFormData {
  type: string;
  publisher: string;
}

export interface JournalPublicationReferenceFormData {
  type: string;
  doi: string;
  journal: string;
  volume: string;
  issue: string;
  peerReview: string;
  pagesFrom: string;
  pagesTo: string;
  articleNumber: string;
}

export interface ReferenceFormData {
  referenceType: string;
  book: BookReferenceFormData;
  journalPublication: JournalPublicationReferenceFormData;
}

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
  publisher: {
    issn: '',
    level: '',
    publisher: '',
    title: '',
  },
  referenceType: ReferenceType.PUBLICATION_IN_JOURNAL,
};

export const emptyContributorsFormData: ContributorsFormData = {
  authors: [],
  contributors: [],
};

export const emptyBookReferenceFormData: BookReferenceFormData = {
  type: '',
  publisher: '',
};

export const emptyJournalPublicationReferenceFormData: JournalPublicationReferenceFormData = {
  type: '',
  doi: '',
  journal: '',
  volume: '',
  issue: '',
  peerReview: 'false',
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
