import { BookType, PublicationType } from '../publicationFieldNames';
import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  ContextPublisher,
  ContextSeries,
} from '../registration.types';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';

export interface BookRegistration extends BaseRegistration {
  entityDescription: BookEntityDescription;
}

export interface BookPublicationInstance {
  type: BookType | '';
  pages: PagesMonograph | null;
}

export const emptyBookPublicationInstance: BookPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
};

export interface BookPublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  publisher?: ContextPublisher;
  seriesNumber: string;
  series?: ContextSeries;
}

interface BookReference extends BaseReference {
  publicationContext: BookPublicationContext;
  publicationInstance: BookPublicationInstance;
}

export interface BookEntityDescription extends BaseEntityDescription {
  reference: BookReference | null;
}
