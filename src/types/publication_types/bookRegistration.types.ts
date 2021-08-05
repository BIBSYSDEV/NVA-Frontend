import { BaseEntityDescription, BaseReference, NviApplicableBase } from '../registration.types';
import { PublicationType, BookType } from '../publicationFieldNames';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';
import { BookMonographContentType } from './content.types';

export interface BookPublicationInstance extends NviApplicableBase<BookMonographContentType> {
  type: BookType | '';
  pages: PagesMonograph | null;
}

export const emptyBookPublicationInstance: BookPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
  contentType: null,
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

interface BookReference extends BaseReference {
  publicationContext: BookPublicationContext;
  publicationInstance: BookPublicationInstance;
}

export interface BookEntityDescription extends BaseEntityDescription {
  reference: BookReference;
}
