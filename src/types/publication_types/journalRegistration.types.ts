import { BackendType, BaseEntityDescription } from '../registration.types';
import { PublicationType, JournalType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { BackendTypeNames, emptyDate } from './commonRegistration.types';
import { emptyPagesRange, PagesRange } from './pages.types';
import i18n from '../../translations/i18n';

export enum JournalArticleContentType {
  ResearchArticle = 'Research article',
  ReviewArticle = 'Review article',
  CaseReport = 'Case report',
  StudyProtocol = 'Study protocol',
  ProfessionalArticle = 'Professional article',
  PopularScienceArticle = 'Popular science article',
}

export interface ContentTypeOption {
  value: string;
  text: string;
}

export const journalArticleContentTypes: ContentTypeOption[] = Object.values(JournalArticleContentType).map(
  (value) => ({
    value,
    text: i18n.t(`registration:resource_type.journal_content_types.${value}`),
  })
);

export interface JournalPublicationInstance {
  type: JournalType | '';
  articleNumber: string;
  issue: string;
  pages: PagesRange;
  peerReviewed: boolean | null;
  volume: string;
  corrigendumFor: string;
  content: JournalArticleContentType | null;
  originalResearch: boolean | null;
}

export interface JournalPublicationContext {
  type: PublicationType | '';
  level: string | number | null;
  onlineIssn?: string;
  printIssn?: string;
  openAccess: boolean;
  peerReviewed: boolean;
  title: string;
  url?: string;
}

interface JournalReference extends BackendType {
  doi: string;
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
  content: null,
  originalResearch: null,
};

const emptyPublicationContext: JournalPublicationContext = {
  type: '',
  level: '',
  onlineIssn: '',
  openAccess: false,
  peerReviewed: false,
  title: '',
  url: '',
};

const emptyReference: JournalReference = {
  type: BackendTypeNames.REFERENCE,
  doi: '',
  publicationContext: emptyPublicationContext,
  publicationInstance: emptyJournalPublicationInstance,
};

export const emptyRegistrationEntityDescription: JournalEntityDescription = {
  type: BackendTypeNames.ENTITY_DESCRIPTION,
  abstract: '',
  contributors: [],
  date: emptyDate,
  description: '',
  language: LanguageValues.NONE,
  mainTitle: '',
  npiSubjectHeading: '',
  reference: emptyReference,
  tags: [],
  controlledKeywords: [],
};
