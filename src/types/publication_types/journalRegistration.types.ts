import { BaseEntityDescription, BaseReference, BaseRegistration, PublicationChannelType } from '../registration.types';
import { JournalType } from '../publicationFieldNames';
import { emptyPagesRange, PagesRange } from './pages.types';

export interface JournalRegistration extends BaseRegistration {
  entityDescription: JournalEntityDescription;
}

export interface JournalPublicationInstance {
  type: JournalType | '';
  articleNumber: string | null;
  issue: string | null;
  pages: PagesRange | null;
  volume: string | null;
  corrigendumFor: string | null;
}

export interface JournalPublicationContext {
  type: PublicationChannelType.UnconfirmedJournal | PublicationChannelType.Journal | '';
  id?: string;
  title?: string;
  onlineIssn?: string;
  printIssn?: string;
}

interface JournalReference extends BaseReference {
  publicationContext: JournalPublicationContext;
  publicationInstance: JournalPublicationInstance;
}

export interface JournalEntityDescription extends BaseEntityDescription {
  reference: JournalReference | null;
}

export const emptyJournalPublicationInstance: JournalPublicationInstance = {
  type: '',
  articleNumber: '',
  issue: '',
  pages: emptyPagesRange,
  volume: '',
  corrigendumFor: '',
};

const emptyPublicationContext: JournalPublicationContext = {
  type: '',
};

const emptyReference: JournalReference = {
  type: 'Reference',
  doi: '',
  publicationContext: emptyPublicationContext,
  publicationInstance: emptyJournalPublicationInstance,
};

export const emptyRegistrationEntityDescription: JournalEntityDescription = {
  type: 'EntityDescription',
  abstract: '',
  alternativeTitles: {},
  contributors: [],
  date: {
    type: 'PublicationDate',
    year: '',
    month: '',
    day: '',
  },
  description: '',
  language: '',
  mainTitle: '',
  npiSubjectHeading: '',
  reference: emptyReference,
  tags: [],
};
