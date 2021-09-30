import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  NviApplicableBase,
  PublicationChannelType,
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
  peerReviewed: null,
};

export interface Series {
  type: PublicationChannelType.Series | PublicationChannelType.UnconfirmedSeries;
  id?: string;
  title?: string;
}

export interface ContextPublisher {
  type: PublicationChannelType.UnconfirmedPublisher | PublicationChannelType.Publisher;
  name?: string;
  id?: string;
}

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
  reference: BookReference;
}
