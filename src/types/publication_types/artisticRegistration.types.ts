import { ArtisticType, PublicationType } from '../publicationFieldNames';
import { BaseRegistration, BaseReference, BaseEntityDescription } from '../registration.types';

export interface ArtisticRegistration extends BaseRegistration {
  entityDescription: ArtisticEntityDescription;
}

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  designType: DesignType | '';
}

export const emptyArtisticPublicationInstance: ArtisticPublicationInstance = {
  type: '',
  designType: '',
};

export interface ArtisticPublicationContext {
  type: PublicationType.Artistic;
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
