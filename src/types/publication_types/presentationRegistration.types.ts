import { Period, Place, UnconfirmedOrganization, emptyPeriod, emptyPlace } from '../common.types';
import { PresentationType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';

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
  name: '',
  agent: { type: 'UnconfirmedOrganization', name: '' },
  place: emptyPlace,
  time: emptyPeriod,
};

export interface PresentationPublicationContext {
  type: PublicationType.Presentation;
  name: string;
  agent: UnconfirmedOrganization | null;
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
