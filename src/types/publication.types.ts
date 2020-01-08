import { Reference } from './references.types';
import { Project } from './project.types';

export enum PublicationType {
  TEXT = 'text',
  FILE = 'file',
}

export enum PublicationFormTabs {
  PUBLICATION,
  DESCRIPTION,
  REFERENCES,
  CONTRIBUTORS,
  FILES_AND_LICENSE,
}

export interface TitleType {
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

export interface PublicationFile {
  checksum: string;
  filename: string;
  mimetype: string;
  size: string;
}

export interface PublicationFileMap {
  indexedDate: string;
  file: PublicationFile;
}

export interface AlmaPublication {
  title: string;
  date: string;
}

export interface DoiPublication {
  url: string;
  owner: string;
}

interface NpiDiscipline {
  id: string;
  title: string;
}

interface Institution {
  id: string;
  name: string;
  institution?: Institution;
}

// TODO: lokk at contributor.types
interface Contributor {
  type: string; // enum?
  name: string;
  institution?: Institution;
  corresponding?: boolean;
  email?: string;
  orcid?: string;
}

interface File {
  title: string;
  license: string; //enum?
  acceptedVersion: boolean;
  administrativeContract: boolean;
  archivePublishDate: string; // date?
}

export interface Publication {
  id: string;
  modified: string; // date?
  createdDate: string; // date?
  createdBy: string;
  title: { [key: string]: string };
  abstract: string;
  description: string;
  npiDisciplines: NpiDiscipline[];
  tags: string[];
  doiLink: string;
  publicationDate: {
    year: string;
    month: string;
    day: string;
  };
  language: string; // enum?
  projects: Project[];
  reference: Reference;
  authors: Contributor[];
  contributors: Contributor[];
  files: File[];
}

export const emptyPublication: Publication = {
  id: '',
  modified: '', // date?
  createdDate: '', // date?
  createdBy: '',
  title: {},
  abstract: '',
  description: '',
  npiDisciplines: [],
  tags: [],
  doiLink: '',
  publicationDate: {
    year: '',
    month: '',
    day: '',
  },
  language: 'no', // enum?
  projects: [],
  reference: {
    type: '',
    journalPublication: {
      type: '',
      link: '',
      journal: {
        issn: '',
        level: '',
        publisher: '',
        title: '',
      },
      issue: '',
      peerReview: false,
      pagesFrom: '',
      pagesTo: '',
      articleNumber: '',
    },
    book: {
      type: '',
      publisher: '',
    },
  },
  authors: [],
  contributors: [], // TODO: Merge with authors
  files: [],
};

export const emptyContributor: Contributor = {
  type: '', // enum?
  name: '',
  institution: undefined,
  corresponding: false,
  email: '',
  orcid: '',
};
