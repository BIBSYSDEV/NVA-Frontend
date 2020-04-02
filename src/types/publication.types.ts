import { Contributor } from './contributor.types';
import { FileSet } from './file.types';
import { LanguageValues } from './language.types';
import { Project } from './project.types';
import { PublicationType, JournalArticleType, ReportType, DegreeType, BookType } from './publicationFieldNames';

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

export interface Publisher {
  type?: string; //TODO: remove this when backend has fixed Reference
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: number | null;
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
  fileSet: FileSet;
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
  projects: Project[];
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
    publicationInstance: {
      volume: string;
      issue: string;
      articleNumber: string;
      peerReviewed: boolean;
      pages: {
        begin: string;
        end: string;
        type?: string; //TODO: remove this when backend has fixed Reference
      };
      type?: string; //TODO: remove this when backend has fixed Reference
    };
    publicationContext: Publisher | null;
    type?: string; //TODO: remove this when backend has fixed Reference
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
  language: LanguageValues.NORWEGIAN_BOKMAL,
  projects: [],
  publicationType: '',
  contributors: [],
  publicationSubtype: '',
  isbn: '',
  numberOfPages: '',
  series: emptyPublisher,
  specialization: '',
  textBook: false,
  reference: {
    type: 'Reference', //TODO: remove this when backend has fixed Reference
    doi: '',
    publicationInstance: {
      type: 'PublicationInstance', //TODO: remove this when backend has fixed Reference
      volume: '',
      issue: '',
      articleNumber: '',
      peerReviewed: false,
      pages: {
        type: 'Pages', //TODO: remove this when backend has fixed Reference
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
  fileSet: {
    type: 'FileSet',
    files: [],
  },
  shouldCreateDoi: false,
};
