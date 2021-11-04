import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';
import { PresentationType, PublicationType } from '../publicationFieldNames';
import { Place, Period } from '../common.types';

export interface PresentationRegistration extends BaseRegistration {
  entityDescription: PresentationEntityDescription;
}

interface PresentationPublicationInstance {
  type: PresentationType | '';
}

export const emptyPresentationPublicationInstance: PresentationPublicationInstance = {
  type: '',
};

export const emptyPresentationPublicationContext: PresentationPublicationContext = {
  type: PublicationType.Presentation,
  label: '',
  agent: { type: 'UnconfirmedOrganization', name: '' },
  place: { type: 'UnconfirmedPlace', label: '', country: '' },
  time: { type: 'Period', from: '', to: '' },
};

interface Agent {
  type: 'UnconfirmedOrganization';
  name: string;
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
