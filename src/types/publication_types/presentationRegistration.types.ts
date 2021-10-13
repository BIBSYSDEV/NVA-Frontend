import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';
import { PresentationType, PublicationType } from '../publicationFieldNames';

export interface PresentationRegistration extends BaseRegistration {
  entityDescription: PresentationEntityDescription;
}

export interface PresentationPublicationInstance {
  type: PresentationType | '';
}

export const emptyPresentationPublicationInstance: PresentationPublicationInstance = {
  type: '',
};

export const emptyPresentationPublicationContext: PresentationPublicationContext = {
  type: PublicationType.Presentation,
  label: '',
  place: {
    type: 'UnconfirmedPlace',
    label: '',
    country: '',
  },
};

export interface PresentationPublicationContext {
  type: PublicationType.Presentation;
  label: string;
  place: {
    type: 'UnconfirmedPlace';
    label: string;
    country: string;
  };
}

interface PresentationReference extends BaseReference {
  publicationContext: PresentationPublicationContext;
  publicationInstance: PresentationPublicationInstance;
}

export interface PresentationEntityDescription extends BaseEntityDescription {
  reference: PresentationReference;
}
