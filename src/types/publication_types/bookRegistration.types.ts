import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  ContextPublisher,
  NviApplicableBase,
  Series,
} from '../registration.types';
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
};

export interface BookPublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  publisher?: ContextPublisher;
  seriesNumber: string;
  series?: Series;
}

interface BookReference extends BaseReference {
  publicationContext: BookPublicationContext;
  publicationInstance: BookPublicationInstance;
}

export interface BookEntityDescription extends BaseEntityDescription {
  reference: BookReference | null;
}
