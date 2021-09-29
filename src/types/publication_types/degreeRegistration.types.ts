import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';
import { PublicationType, DegreeType } from '../publicationFieldNames';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';
import { ContextPublisher, Series } from './bookRegistration.types';

export interface DegreeRegistration extends BaseRegistration {
  entityDescription: DegreeEntityDescription;
}

export interface DegreePublicationInstance {
  type: DegreeType | '';
  pages: PagesMonograph | null;
}

export const emptyDegreePublicationInstance: DegreePublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
};

export interface DegreePublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  publisher?: ContextPublisher;
  seriesNumber: string;
  series?: Series;
}

interface DegreeReference extends BaseReference {
  publicationContext: DegreePublicationContext;
  publicationInstance: DegreePublicationInstance;
}

export interface DegreeEntityDescription extends BaseEntityDescription {
  reference: DegreeReference;
}
