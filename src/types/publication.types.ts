import { Contributor } from './contributor.types';
import { FileSet } from './file.types';
import { LanguageValues } from './language.types';
import { Project } from './project.types';
import { PublicationType, JournalArticleType, ReportType, DegreeType, BookType } from './publicationFieldNames';
import { EnumDictionary } from './common.types';

export enum PublicationStatus {
  DRAFT = 'draft',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
}

export const levelMap: EnumDictionary<string, number | null> = {
  NO_LEVEL: null,
  LEVEL_0: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
};

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

export interface Publisher {
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: string | number | null;
  openAccess: boolean;
}

export const emptyPublisher: Publisher = {
  printIssn: '',
  onlineIssn: '',
  level: null,
  title: '',
  openAccess: false,
};

export interface AlmaPublication {
  title: string;
}

export interface NpiDiscipline {
  id: string;
  name: string;
  mainDiscipline: string;
}

interface NpiSubdomain {
  id: string;
  name: string;
}

export interface Publication {
  readonly identifier: string;
  readonly createdDate: string;
  readonly owner: string;
  readonly status: PublicationStatus;
  entityDescription: PublicationEntityDescription;
  fileSet: FileSet;
  project: Project | null;
}

interface PublicationInstance {
  articleNumber: string;
  issue: string;
  pages: {
    begin: string;
    end: string;
  };
  peerReviewed: boolean;
  volume: string;
}

interface PublicationEntityDescription {
  mainTitle: string;
  abstract: string;
  description: string;
  tags: string[];
  npiSubjectHeading: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
  language: LanguageValues;
  publicationType: PublicationType | '';
  publicationSubtype: JournalArticleType | ReportType | DegreeType | BookType | '';
  contributors: Contributor[];
  isbn: string;
  numberOfPages: string;
  series: Publisher;
  specialization: string;
  textBook: boolean;
  reference: {
    doi: string;
    publicationInstance: PublicationInstance;
    publicationContext: Publisher | null;
  };
}

export interface FormikPublication extends Publication {
  shouldCreateDoi: boolean;
}

const emptyPublicationInstance: PublicationInstance = {
  volume: '',
  issue: '',
  articleNumber: '',
  pages: {
    begin: '',
    end: '',
  },
  peerReviewed: false,
};

const emptyPublicationEntityDescription: PublicationEntityDescription = {
  mainTitle: '',
  abstract: '',
  description: '',
  tags: [],
  npiSubjectHeading: '',
  date: {
    year: '',
    month: '',
    day: '',
  },
  language: LanguageValues.NORWEGIAN_BOKMAL,
  publicationType: '',
  contributors: [],
  publicationSubtype: '',
  isbn: '',
  numberOfPages: '',
  series: emptyPublisher,
  specialization: '',
  textBook: false,
  reference: {
    doi: '',
    publicationInstance: emptyPublicationInstance,
    publicationContext: null,
  },
};

export type PublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'owner'
>;
export type PublishedPublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'date' | 'reference' | 'contributors' | 'status' | 'publicationType'
>;

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyPublication: FormikPublication = {
  identifier: '',
  createdDate: '',
  owner: '',
  status: PublicationStatus.DRAFT,
  entityDescription: emptyPublicationEntityDescription,
  fileSet: {
    type: 'FileSet',
    files: [],
  },
  shouldCreateDoi: false,
  project: null,
};
