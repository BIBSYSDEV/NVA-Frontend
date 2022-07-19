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

interface UnconfirmedPublisher {
  type: 'UnconfirmedPublisher';
  name: string;
}

export interface Broadcast extends ArtisticOutputBase {
  type: 'Broadcast';
  publisher: UnconfirmedPublisher;
  date: Instant;
}

export interface CinematicRelease extends ArtisticOutputBase {
  type: 'CinematicRelease';
  place: Place;
  date: Instant;
}

export interface OtherRelease extends ArtisticOutputBase {
  type: 'OtherRelease';
  description: string;
  place: Place;
  publisher: UnconfirmedPublisher;
  date: Instant;
}

export interface MusicScore extends ArtisticOutputBase {
  type: 'MusicScore';
  ensemble: string;
  movements: string;
  extent: string;
  publisher: UnconfirmedPublisher;
  ismn: {
    type: 'Ismn';
    value: string;
    formatted?: string;
  };
  isrc: {
    type: 'Isrc';
    value: string;
  };
}

export interface MusicalWorkPerformance {
  type: 'MusicalWorkPerformance';
  title: string;
  composer: string;
  premiere: boolean;
}

export interface Concert extends ArtisticOutputBase {
  type: 'Concert';
  place: Place;
  time: Instant;
  extent: string;
  description: string;
  concertProgramme: MusicalWorkPerformance[];
}

export enum MusicMediaType {
  CompactDisc = 'CompactDisc',
  DVD = 'DVD',
  Streaming = 'Streaming',
  DigitalFile = 'DigitalFile',
  Vinyl = 'Vinyl',
  Other = 'Other',
}

export interface MusicTrack {
  type: 'MusicTrack';
  title: string;
  composer: string;
  extent: string;
}

export interface AudioVisualPublication extends ArtisticOutputBase {
  type: 'AudioVisualPublication';
  mediaType: MusicMediaType | '';
  publisher: string;
  catalogueNumber: string;
  trackList: MusicTrack[];
}

export type FilmOutput = Broadcast | CinematicRelease | OtherRelease;
export type ArchitectureOutput = Competition | MentionInPublication | Award | Exhibition;
export type MusicOutput = MusicScore | AudioVisualPublication | Concert;

export type ArtisticOutputItem = Venue | ArchitectureOutput | FilmOutput | MusicOutput;

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  subtype: ArtisticSubtype | null;
  description: string;
  venues?: Venue[];
  architectureOutput?: ArchitectureOutput[];
  outputs?: Venue[] | FilmOutput[];
  manifestations?: MusicOutput[];
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
