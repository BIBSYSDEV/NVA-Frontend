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
  agent: null,
  place: null,
  time: null,
};

interface Agent {
  type: 'UnconfirmedOrganization';
  name: string;
}

interface Place {
  type: 'UnconfirmedPlace';
  label: string;
  country: string;
}

interface Period {
  type: 'Period';
  from: string;
  to: string;
}

export interface PresentationPublicationContext {
  type: PublicationType.Presentation;
  label: string;
  agent: Agent | null;
  place: Place | null;
  time: Period | null;
}

interface PresentationReference extends BaseReference {
  publicationContext: PresentationPublicationContext;
  publicationInstance: PresentationPublicationInstance;
}

export interface PresentationEntityDescription extends BaseEntityDescription {
  reference: PresentationReference;
}
