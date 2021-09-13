import { BaseEntityDescription, BaseReference, BaseRegistration, NviApplicableBase } from '../registration.types';
import { PublicationType, BookType } from '../publicationFieldNames';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';
import { BookMonographContentType } from './content.types';

export interface BookRegistration extends BaseRegistration {
  entityDescription: BookEntityDescription;
}

export interface BookPublicationInstance extends NviApplicableBase<BookMonographContentType> {
  type: BookType | '';
  pages: PagesMonograph | null;
}

export const emptyBookPublicationInstance: BookPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
  contentType: null,
  peerReviewed: null,
};

export interface Series {
  type: 'Series' | 'UnconfirmedSeries';
  id?: string;
  title?: string;
}

export interface BookPublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  level: string | null;
  openAccess: boolean;
  peerReviewed: boolean;
  publisher: string;
  seriesNumber: string;
  series: Series;
  url: string;
}

interface BookReference extends BaseReference {
  publicationContext: BookPublicationContext;
  publicationInstance: BookPublicationInstance;
}

export interface BookEntityDescription extends BaseEntityDescription {
  reference: BookReference;
}
