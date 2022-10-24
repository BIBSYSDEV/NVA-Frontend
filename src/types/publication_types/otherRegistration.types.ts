import { BaseEntityDescription, BaseReference, BaseRegistration, ContextPublisher } from '../registration.types';
import { OtherRegistrationType, PublicationType } from '../publicationFieldNames';

export interface MapRegistration extends BaseRegistration {
  entityDescription: MapEntityDescription;
}

export interface MapPublicationInstance {
  type: OtherRegistrationType.Map;
}

export const emptyMapPublicationInstance: MapPublicationInstance = {
  type: OtherRegistrationType.Map,
};

export interface MapPublicationContext {
  type: PublicationType.GeographicalContent;
  publisher: ContextPublisher;
}

interface MapReference extends BaseReference {
  publicationContext: MapPublicationContext;
  publicationInstance: MapPublicationInstance;
}

export interface MapEntityDescription extends BaseEntityDescription {
  reference: MapReference;
}
