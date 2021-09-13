import { BaseEntityDescription, BaseReference, BaseRegistration, NviApplicableBase } from '../registration.types';
import { PublicationType, JournalType } from '../publicationFieldNames';
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
  type: PublicationType | '';
  level: string | null;
  onlineIssn?: string;
  printIssn?: string;
  openAccess: boolean;
  peerReviewed: boolean;
  title: string;
  url?: string;
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
  level: null,
  onlineIssn: '',
  openAccess: false,
  peerReviewed: false,
  title: '',
  url: '',
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
