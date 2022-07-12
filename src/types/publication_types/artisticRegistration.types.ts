import { Instant, Period, Place } from '../common.types';
import { ArtisticType, PublicationType } from '../publicationFieldNames';
import { BaseRegistration, BaseReference, BaseEntityDescription } from '../registration.types';

export interface ArtisticRegistration extends BaseRegistration {
  entityDescription: ArtisticEntityDescription;
}

export interface Venue {
  type: 'Venue' | 'PerformingArtsVenue';
  place: Place | null;
  date: Period | null;
}

export interface Competition {
  type: 'Competition';
  name: string;
  description: string;
  date: Instant;
  sequence: number;
}

export interface MentionInPublication {
  type: 'MentionInPublication';
  title: string;
  issue: string;
  date: Instant;
  otherInformation: string;
  sequence: number;
}

export interface Award {
  type: 'Award';
  name: string;
  organizer: string;
  date: Instant;
  otherInformation: string;
  ranking: number;
  sequence: number;
}

export interface Exhibition {
  type: 'Exhibition';
  name: string;
  organizer: string;
  place: Place | null;
  date: Period | null;
  otherInformation: string;
  sequence: number;
}

export type ArchitectureOutput = Competition | MentionInPublication | Award | Exhibition;

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  subtype: ArtisticSubtype | null;
  description: string;
  venues?: Venue[];
  architectureOutput?: ArchitectureOutput[];
  outputs?: Venue[];
}

export const emptyArtisticPublicationInstance: ArtisticPublicationInstance = {
  type: '',
  subtype: { type: '' },
  description: '',
  venues: [],
};

interface ArtisticPublicationContext {
  type: PublicationType.Artistic;
}

interface ArtisticReference extends BaseReference {
  publicationContext: ArtisticPublicationContext;
  publicationInstance: ArtisticPublicationInstance;
}

export interface ArtisticEntityDescription extends BaseEntityDescription {
  reference: ArtisticReference;
}

interface ArtisticSubtype {
  type: DesignType | ArchitectureType | PerformingArtType | MovingPictureType | '';
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

export enum ArchitectureType {
  Building = 'Building',
  PlanningProposal = 'PlanningProposal',
  LandscapeArchitecture = 'LandscapeArchitecture',
  Interior = 'Interior',
  Other = 'Other',
}

export enum PerformingArtType {
  TheatricalProduction = 'TheatricalProduction',
  Broadcast = 'Broadcast',
  Other = 'Other',
}

export enum MovingPictureType {
  LongFilm = 'Film',
  ShortFilm = 'ShortFilm',
  Seruial = 'SerialFilmProduction',
  InteractiveFilm = 'InteractiveFilm',
  AugmentedVirtualRealityFilm = 'AugmentedVirtualRealityFilm',
  Other = 'Other',
}
