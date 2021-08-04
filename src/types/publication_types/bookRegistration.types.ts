import { BackendType, BaseEntityDescription } from '../registration.types';
import { PublicationType, BookType } from '../publicationFieldNames';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';

export enum BookMonographContentType {
  AcademicMonograph = 'Academic Monograph',
  NonFictionMonograph = 'Non-fiction Monograph',
  PopularScienceMonograph = 'Popular Science Monograph',
  Textbook = 'Textbook',
  Encyclopedia = 'Encyclopedia',
}

export interface BookPublicationInstance {
  type: BookType | '';
  pages: PagesMonograph | null;
  content: BookMonographContentType | null;
  peerReviewed: boolean | null;
  originalResearch: boolean | null;
}

export const emptyBookPublicationInstance: BookPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
  content: null,
  peerReviewed: null,
  originalResearch: null,
};

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

export interface BookEntityDescription extends BaseEntityDescription {
  reference: BookReference;
}
