import { BackendType, PublicationDate, PagesMonograph } from '../publication.types';
import { PublicationType, BookType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { Contributor } from '../contributor.types';
import { BackendTypeNames, emptyDate } from './common.publication.types';

interface BookPublicationInstance {
  type: BookType | '';
  pages: PagesMonograph | null;
  peerReviewed: boolean;
}

export interface BookPublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  level: string | number | null;
  openAccess: boolean;
  peerReviewed: boolean;
  publisher: string;
  seriesNumber: string;
  seriesTitle: string;
  url: string;
}

interface BookReference extends BackendType {
  doi: string;
  publicationContext: BookPublicationContext;
  publicationInstance: BookPublicationInstance;
}

export interface BookEntityDescription extends BackendType {
  abstract: string;
  alternativeTitles?: string;
  contributors: Contributor[];
  date: PublicationDate;
  description: string;
  language: LanguageValues;
  metadataSource?: string;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: BookReference;
  tags: string[];
}

export const emptyPublicationInstance: BookPublicationInstance = {
  type: '',
  pages: null,
  peerReviewed: false,
};

export const emptyPublicationContext: BookPublicationContext = {
  type: '',
  isbnList: [],
  level: '',
  openAccess: false,
  peerReviewed: false,
  publisher: '',
  seriesNumber: '',
  seriesTitle: '',
  url: '',
};

export const emptyReference: BookReference = {
  type: BackendTypeNames.REFERENCE,
  doi: '',
  publicationContext: emptyPublicationContext,
  publicationInstance: emptyPublicationInstance,
};

export const emptyPublicationEntityDescription: BookEntityDescription = {
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
