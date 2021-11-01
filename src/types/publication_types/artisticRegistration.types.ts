import { ArtisticType, PublicationType } from '../publicationFieldNames';
import { BaseRegistration, BaseReference, BaseEntityDescription } from '../registration.types';

export interface ArtisticRegistration extends BaseRegistration {
  entityDescription: ArtisticEntityDescription;
}

export interface Venue {
  name: string;
}

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  designType: DesignType | '';
  description: string;
}

export const emptyArtisticPublicationInstance: ArtisticPublicationInstance = {
  type: '',
  designType: '',
  description: '',
};

export interface ArtisticPublicationContext {
  type: PublicationType.Artistic;
  venues: Venue[];
}

interface ArtisticReference extends BaseReference {
  publicationContext: ArtisticPublicationContext;
  publicationInstance: ArtisticPublicationInstance;
}

export interface ArtisticEntityDescription extends BaseEntityDescription {
  reference: ArtisticReference;
}

export enum DesignType {
  Product = 'Product',
  InteriorArchitecture = 'InteriorArchitecture',
  ClothingDesign = 'ClothingDesign',
  LightingDesign = 'LightingDesign',
  Exhibition = 'Exhibition',
  GraphicalDesign = 'GraphicalDesign',
  Illustration = 'Illustration',
  WebDesign = 'WebDesign',
  ServiceDesign = 'ServiceDesign',
  Other = 'Other',
}
