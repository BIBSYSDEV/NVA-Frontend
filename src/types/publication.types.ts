import { Contributor } from './contributor.types';
import { File } from './file.types';
import { LanguageCodes } from './language.types';
import { Project } from './project.types';
import {
  ReferenceType,
  JournalArticleType,
  emptyPublisher,
  Publisher,
  ReportType,
  DegreeType,
  BookType,
} from './references.types';

export enum PublicationType {
  TEXT = 'text',
  FILE = 'file',
}

export enum PublicationStatus {
  DRAFT = 'draft',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
}

interface TitleType {
  [key: string]: string;
}

export interface PublicationMetadata {
  creators: string[];
  handle: string;
  license: string;
  publicationYear: number;
  publisher: string;
  titles: TitleType;
  type: PublicationType;
}

export interface AlmaPublication {
  title: string;
}

export interface NpiDiscipline {
  id: string;
  name: string;
  mainDiscipline: string;
}

export interface NpiSubject {
  id: string;
  subjectArea: string;
  subdomains: NpiSubdomain[];
}

export interface NpiSubdomain {
  id: string;
  name: string;
}

export const emptyNpiDiscipline: NpiDiscipline = {
  id: '',
  name: '',
  mainDiscipline: '',
};

// TODO: rename to Publication once all fields are mapped
export interface BackendPublication {
  identifier: string;
  entityDescription: PublicationEntityDescription;
  fileSet: File[];
}

export interface Publication extends BackendPublication {
  modified: string; // date?
  createdDate: string; // date?
  createdBy: string;
  status: PublicationStatus;
  shouldCreateDoi: boolean;
}

interface PublicationEntityDescription {
  mainTitle: string;
  mainLanguageAbstract: string;
  description: string;
  tags: string[];
  npiSubjectHeading: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
  language: LanguageCodes;
  projects: Project[];
  publicationType: ReferenceType | '';
  publicationSubtype: JournalArticleType | ReportType | DegreeType | BookType | '';
  contributors: Contributor[];
  doiUrl: string;
  publisher: Publisher;
  volume: string;
  issue: string;
  pagesFrom: string;
  pagesTo: string;
  peerReview: boolean;
  articleNumber: string;
  isbn: string;
  numberOfPages: string;
  series: Publisher;
  specialization: string;
  textBook: boolean;
}

const emptyPublicationEntityDescription: PublicationEntityDescription = {
  mainTitle: '',
  mainLanguageAbstract: '',
  description: '',
  tags: [],
  npiSubjectHeading: '',
  date: {
    year: '',
    month: '',
    day: '',
  },
  language: LanguageCodes.NORWEGIAN_BOKMAL,
  projects: [],
  publicationType: '',
  contributors: [],
  doiUrl: '',
  publicationSubtype: '',
  publisher: emptyPublisher,
  volume: '',
  issue: '',
  pagesFrom: '',
  pagesTo: '',
  peerReview: false,
  articleNumber: '',
  isbn: '',
  numberOfPages: '',
  series: emptyPublisher,
  specialization: '',
  textBook: false,
};

export type PublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'createdBy'
>;
export type PublishedPublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'date' | 'publisher' | 'contributors' | 'status' | 'publicationType'
>;

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyPublication: Publication = {
  modified: '', // date?
  createdDate: '', // date?
  createdBy: '',
  status: PublicationStatus.DRAFT,
  shouldCreateDoi: false,

  // Fields from backend
  identifier: '',
  entityDescription: emptyPublicationEntityDescription,
  fileSet: [],
};
