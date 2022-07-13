import { Instant, Period, Place } from '../common.types';
import { ArtisticType, PublicationType } from '../publicationFieldNames';
import { BaseRegistration, BaseReference, BaseEntityDescription } from '../registration.types';

export interface ArtisticRegistration extends BaseRegistration {
  entityDescription: ArtisticEntityDescription;
}

interface ArtisticOutputBase {
  sequence?: number;
}

export interface Venue extends ArtisticOutputBase {
  type: 'Venue' | 'PerformingArtsVenue';
  place: Place | null;
  date: Period | null;
}

export interface Competition extends ArtisticOutputBase {
  type: 'Competition';
  name: string;
  description: string;
  date: Instant;
}

export interface MentionInPublication extends ArtisticOutputBase {
  type: 'MentionInPublication';
  title: string;
  issue: string;
  date: Instant;
  otherInformation: string;
}

export interface Award extends ArtisticOutputBase {
  type: 'Award';
  name: string;
  organizer: string;
  date: Instant;
  otherInformation: string;
  ranking: number;
}

export interface Exhibition extends ArtisticOutputBase {
  type: 'Exhibition';
  name: string;
  organizer: string;
  place: Place | null;
  date: Period | null;
  otherInformation: string;
}

export interface Broadcast extends ArtisticOutputBase {
  type: 'Broadcast';
  publisher: {
    type: 'UnconfirmedPublisher';
    name: string;
  };
  date: Instant;
}

interface CinematicRelease extends ArtisticOutputBase {
  type: 'CinematicRelease';
  // TODO
}

interface OtherRelease extends ArtisticOutputBase {
  type: 'OtherRelease';
  // TODO
}

export type FilmOutput = Broadcast | CinematicRelease | OtherRelease;

export type ArchitectureOutput = Competition | MentionInPublication | Award | Exhibition;

export type ArtisticOutputItem = Venue | ArchitectureOutput | FilmOutput;

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  subtype: ArtisticSubtype | null;
  description: string;
  venues?: Venue[];
  architectureOutput?: ArchitectureOutput[];
  outputs?: Venue[] | FilmOutput[];
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
