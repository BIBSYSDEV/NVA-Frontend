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
  time: {
    type: 'TemporalExtent',
    from: '',
    to: '',
  },
};

interface Place {
  type: 'UnconfirmedPlace';
  label: string;
  country: string;
}

interface Time {
  type: 'TemporalExtent';
  from: string;
  to: string;
}

export interface PresentationPublicationContext {
  type: PublicationType.Presentation;
  agent?: any; // TODO: NP-3292
  label: string;
  place: Place | null;
  time: Time | null;
}

interface PresentationReference extends BaseReference {
  publicationContext: PresentationPublicationContext;
  publicationInstance: PresentationPublicationInstance;
}

export interface PresentationEntityDescription extends BaseEntityDescription {
  reference: PresentationReference;
}
