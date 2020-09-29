import {
  BackendType,
  PublicationDate,
  PagesMonograph,
  emptyPagesMonograph,
  PagesRange,
  emptyPagesRange,
} from '../publication.types';
import { PublicationType, BookType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { Contributor } from '../contributor.types';

interface BookPublicationInstance {
  type: BookType | '';
  pages: PagesMonograph | null;
  peerReviewed: boolean;
  textbookContent?: boolean;
}

export const emptyBookPublicationInstance: BookPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
  peerReviewed: false,
  textbookContent: false,
};

interface BookPublicationContext {
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
  contributors: Contributor[];
  date: PublicationDate;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: BookReference;
  tags: string[];
}

interface ChapterPublicationInstance {
  type: BookType.CHAPTER;
  pages: PagesRange | null;
  peerReviewed: boolean;
  textbookContent?: boolean;
}

export const emptyChapterPublicationInstance: ChapterPublicationInstance = {
  type: BookType.CHAPTER,
  pages: emptyPagesRange,
  peerReviewed: false,
  textbookContent: false,
};

interface ChapterPublicationContext {
  type: 'Chapter';
  linkedContext: string;
}

interface ChapterReference extends BackendType {
  doi: string;
  publicationContext: ChapterPublicationContext;
  publicationInstance: ChapterPublicationInstance;
}

export interface ChapterEntityDescription extends BackendType {
  abstract: string;
  contributors: Contributor[];
  date: PublicationDate;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: ChapterReference;
  tags: string[];
}
