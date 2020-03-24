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

export interface Publication {
  readonly identifier: string;
  readonly createdDate: string;
  readonly owner: string;
  readonly status: PublicationStatus;
  entityDescription: PublicationEntityDescription;
  fileSet: File[];
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
  language: LanguageCodes;
  projects: Project[];
  publicationType: ReferenceType | '';
  publicationSubtype: JournalArticleType | ReportType | DegreeType | BookType | '';
  contributors: Contributor[];
  peerReview: boolean;
  isbn: string;
  numberOfPages: string;
  series: Publisher;
  specialization: string;
  textBook: boolean;
  reference: {
    doi: string;
    publicationInstance: {
      volume: string;
      issue: string;
      articleNumber: string;
      pages: {
        begin: string;
        end: string;
      };
    };
    publicationContext: Publisher | null;
  };
}

export interface FormikPublication extends Publication {
  shouldCreateDoi: boolean;
}

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
  language: LanguageCodes.NORWEGIAN_BOKMAL,
  projects: [],
  publicationType: '',
  contributors: [],
  publicationSubtype: '',
  peerReview: false,
  isbn: '',
  numberOfPages: '',
  series: emptyPublisher,
  specialization: '',
  textBook: false,
  reference: {
    doi: '',
    publicationInstance: {
      volume: '',
      issue: '',
      articleNumber: '',
      pages: {
        begin: '',
        end: '',
      },
    },
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
  fileSet: [],
  shouldCreateDoi: false,
};
