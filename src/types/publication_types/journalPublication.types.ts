import { BackendType, PagesRange, PublicationDateWithType } from '../publication.types';
import { PublicationType, JournalType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { Contributor } from '../contributor.types';
import { BackendTypeNames, emptyDate } from './commonPublication.types';

export interface JournalPublicationInstance {
  type: JournalType | '';
  articleNumber: string;
  issue: string;
  pages: PagesRange | null;
  peerReviewed: boolean;
  volume: string;
}

export interface JournalPublicationContext {
  type: PublicationType | '';
  level: string | number | null;
  onlineIssn: string;
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

export interface JournalEntityDescription extends BackendType {
  abstract: string;
  contributors: Contributor[];
  date: PublicationDateWithType;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: JournalReference;
  tags: string[];
}

export const emptyJournalPublicationInstance: JournalPublicationInstance = {
  type: '',
  articleNumber: '',
  issue: '',
  pages: null,
  peerReviewed: false,
  volume: '',
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

export const emptyPublicationEntityDescription: JournalEntityDescription = {
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
};
