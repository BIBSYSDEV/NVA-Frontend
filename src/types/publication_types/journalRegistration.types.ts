import { BaseEntityDescription, BaseReference, BaseRegistration, NviApplicableBase } from '../registration.types';
import { JournalType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { emptyPagesRange, PagesRange } from './pages.types';
import { JournalArticleContentType } from './content.types';

export interface JournalRegistration extends BaseRegistration {
  entityDescription: JournalEntityDescription;
}

export interface JournalPublicationInstance extends NviApplicableBase<JournalArticleContentType> {
  type: JournalType | '';
  articleNumber: string;
  issue: string;
  pages: PagesRange;
  volume: string;
  corrigendumFor: string;
}

export interface JournalPublicationContext {
  type: 'UnconfirmedJournal' | 'Journal' | '';
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
  reference: JournalReference;
}

export const emptyJournalPublicationInstance: JournalPublicationInstance = {
  type: '',
  articleNumber: '',
  issue: '',
  pages: emptyPagesRange,
  peerReviewed: null,
  volume: '',
  corrigendumFor: '',
  contentType: null,
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
  contributors: [],
  date: {
    type: 'PublicationDate',
    year: '',
    month: '',
    day: '',
  },
  description: '',
  language: LanguageValues.NONE,
  mainTitle: '',
  npiSubjectHeading: '',
  reference: emptyReference,
  tags: [],
};
