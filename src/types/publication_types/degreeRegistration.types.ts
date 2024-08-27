import { DegreeType, PublicationType } from '../publicationFieldNames';
import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  ContextPublisher,
  ContextSeries,
  RelatedDocument,
} from '../registration.types';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';

export interface DegreeRegistration extends BaseRegistration {
  entityDescription: DegreeEntityDescription;
}

export interface DegreePublicationInstance {
  type: DegreeType | '';
  pages: PagesMonograph | null;
  related?: RelatedDocument[];
}

export const emptyDegreePublicationInstance: DegreePublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
  related: [],
};

export interface DegreePublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  publisher?: ContextPublisher;
  seriesNumber: string;
  series?: ContextSeries;
  course?: {
    type: 'UnconfirmedCourse';
    code: string;
  };
}

interface DegreeReference extends BaseReference {
  publicationContext: DegreePublicationContext;
  publicationInstance: DegreePublicationInstance;
}

export interface DegreeEntityDescription extends BaseEntityDescription {
  reference: DegreeReference;
}
