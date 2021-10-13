import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';
import { PresentationType, PublicationType } from '../publicationFieldNames';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';

export interface PresentationRegistration extends BaseRegistration {
  entityDescription: PresentationEntityDescription;
}

export interface PresentationPublicationInstance {
  type: PresentationType | '';
  pages: PagesMonograph | null;
}

export const emptyPresentationPublicationInstance: PresentationPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
};

export interface PresentationPublicationContext {
  type: PublicationType | '';
}

interface PresentationReference extends BaseReference {
  publicationContext: PresentationPublicationContext;
  publicationInstance: PresentationPublicationInstance;
}

export interface PresentationEntityDescription extends BaseEntityDescription {
  reference: PresentationReference;
}
