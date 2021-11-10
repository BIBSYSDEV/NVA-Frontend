import { Period, Place } from '../common.types';
import { ArtisticType, PublicationType } from '../publicationFieldNames';
import { BaseRegistration, BaseReference, BaseEntityDescription } from '../registration.types';

export interface ArtisticRegistration extends BaseRegistration {
  entityDescription: ArtisticEntityDescription;
}

export interface Venue {
  type: 'Venue';
  place: Place | null;
  time: Period | null;
}

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  subtype: DesignSubtype | null;
  description: string;
}

export const emptyArtisticPublicationInstance: ArtisticPublicationInstance = {
  type: '',
  subtype: { type: '' },
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

interface DesignSubtype {
  type: DesignType | '';
  description?: string;
}

export enum DesignType {
  ProductDesign = 'ProductDesign',
  InteriorDesign = 'InteriorDesign',
  ClothingDesign = 'ClothingDesign',
  LightDesign = 'LightDesign',
  Exhibition = 'Exhibition',
  GraphicDesign = 'GraphicDesign',
  Illustration = 'Illustration',
  WebDesign = 'WebDesign',
  InteractionDesign = 'InteractionDesign',
  ServiceDesign = 'ServiceDesign',
  Other = 'Other',
}
