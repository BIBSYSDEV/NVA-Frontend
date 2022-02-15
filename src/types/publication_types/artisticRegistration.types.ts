import { Instant, Period, Place } from '../common.types';
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

interface Competition {
  type: 'Competition';
  name: string;
  description: string;
  date: Instant;
  otherInformation: string;
  sequence: number;
}

interface MentionInPublication {
  type: 'MentionInPublication';
  title: string;
  issue: string;
  date: Instant;
  otherInformation: string;
  sequence: number;
}

interface Award {
  type: 'Award';
  name: string;
  organizer: string;
  date: Instant;
  otherInformation: string;
  ranking: number;
  sequence: number;
}

interface Exhibition {
  type: 'Exhibition';
  name: string;
  organizer: string;
  place: Place | null;
  date: Period | null;
  otherInformation: string;
  sequence: number;
}

type ArchitectureOutput = Competition | MentionInPublication | Award | Exhibition;

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  subtype: DesignSubtype | null;
  description: string;
  venues?: Venue[];
  architectureOutput?: ArchitectureOutput[];
}

export const emptyArtisticPublicationInstance: ArtisticPublicationInstance = {
  type: '',
  subtype: { type: '' },
  description: '',
  venues: [],
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
