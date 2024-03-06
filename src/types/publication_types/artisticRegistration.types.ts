import { Instant, Period, Place } from '../common.types';
import { ArtisticType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration, RegistrationDate } from '../registration.types';
import { PagesMonograph } from './pages.types';

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
  issue?: string;
  date: Instant;
  otherInformation: string;
}

export interface Award extends ArtisticOutputBase {
  type: 'Award';
  name: string;
  organizer: string;
  date: Instant;
  otherInformation: string;
  ranking: number | null;
}

export interface Exhibition extends ArtisticOutputBase {
  type: 'Exhibition';
  name: string;
  organizer: string;
  place: Place | null;
  date: Period | null;
  otherInformation: string;
}

export interface UnconfirmedPublisher {
  type: 'UnconfirmedPublisher';
  name: string;
}

export const emptyUnconfirmedPublisher: UnconfirmedPublisher = {
  type: 'UnconfirmedPublisher',
  name: '',
};

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
  ismn?: {
    type: 'Ismn';
    value: string;
    formatted?: string;
  };
}

export interface LiteraryArtsMonograph {
  type: 'LiteraryArtsMonograph';
  publisher: UnconfirmedPublisher;
  publicationDate: RegistrationDate;
  isbnList: string[];
  pages: PagesMonograph;
}

export enum LiteraryArtsAudioVisualSubtype {
  Audiobook = 'Audiobook',
  RadioPlay = 'RadioPlay',
  ShortFilm = 'ShortFilm',
  Podcast = 'Podcast',
  Other = 'LiteraryArtsAudioVisualOther',
}

export interface LiteraryArtsAudioVisual {
  type: 'LiteraryArtsAudioVisual';
  subtype: {
    type: LiteraryArtsAudioVisualSubtype | '';
    description: string;
  };
  publisher: UnconfirmedPublisher;
  publicationDate: RegistrationDate;
  isbnList: string[];
  extent: string;
}

export enum LiteraryArtsPerformanceSubtype {
  Reading = 'Reading',
  Play = 'Play',
  Other = 'LiteraryArtsPerformanceOther',
}

export interface LiteraryArtsPerformance {
  type: 'LiteraryArtsPerformance';
  subtype: {
    type: LiteraryArtsPerformanceSubtype | '';
    description: string;
  };

  place: Place;
  publicationDate: RegistrationDate;
}

export interface LiteraryArtsWeb {
  type: 'LiteraryArtsWeb';
  id: string;
  publisher: UnconfirmedPublisher;
  publicationDate: RegistrationDate;
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
  time: Instant | Period;
  extent: string;
  concertProgramme: MusicalWorkPerformance[];
  concertSeries: string;
}

export enum MusicMediaType {
  CompactDisc = 'CompactDisc',
  DVD = 'DVD',
  Streaming = 'Streaming',
  DigitalFile = 'DigitalFile',
  Vinyl = 'Vinyl',
  Other = 'MusicMediaOther',
}

export interface MusicTrack {
  type: 'MusicTrack';
  title: string;
  composer: string;
  extent: string;
}

export interface AudioVisualPublication extends ArtisticOutputBase {
  type: 'AudioVisualPublication';
  mediaType: {
    type: MusicMediaType | '';
    description: string;
  };
  publisher: UnconfirmedPublisher;
  catalogueNumber: string;
  trackList: MusicTrack[];
  isrc?: {
    type: 'Isrc';
    value: string;
  };
}

export interface MusicalWork {
  type: 'MusicalWork';
  title: string;
  composer: string;
}

export interface OtherMusicPerformance extends ArtisticOutputBase {
  type: 'OtherPerformance';
  performanceType: string;
  place?: Place;
  extent: string;
  musicalWorks: MusicalWork[];
}

export type FilmOutput = Broadcast | CinematicRelease | OtherRelease;
export type ArchitectureOutput = Competition | MentionInPublication | Award | Exhibition;
export type MusicOutput = MusicScore | AudioVisualPublication | Concert | OtherMusicPerformance;
export type LiteraryArtsOutput =
  | LiteraryArtsMonograph
  | LiteraryArtsAudioVisual
  | LiteraryArtsPerformance
  | LiteraryArtsWeb;

export type ArtisticOutputItem = Venue | ArchitectureOutput | FilmOutput | MusicOutput | LiteraryArtsOutput;

export interface ArtisticPublicationInstance {
  type: ArtisticType | '';
  subtype: ArtisticSubtype | null;
  description: string;
  venues?: Venue[];
  architectureOutput?: ArchitectureOutput[];
  outputs?: Venue[] | FilmOutput[];
  manifestations?: MusicOutput[] | LiteraryArtsOutput[];
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
  type: DesignType | ArchitectureType | PerformingArtType | MovingPictureType | VisualArtType | LiteraryArtsType | '';
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
  Other = 'ArtisticDesignOther',
}

export enum ArchitectureType {
  Building = 'Building',
  PlanningProposal = 'PlanningProposal',
  LandscapeArchitecture = 'LandscapeArchitecture',
  Interior = 'Interior',
  Other = 'ArchitectureOther',
}

export enum PerformingArtType {
  TheatricalProduction = 'TheatricalProduction',
  Broadcast = 'Broadcast',
  Other = 'PerformingArtsOther',
}

export enum MovingPictureType {
  LongFilm = 'Film',
  ShortFilm = 'ShortFilm',
  Seruial = 'SerialFilmProduction',
  InteractiveFilm = 'InteractiveFilm',
  AugmentedVirtualRealityFilm = 'AugmentedVirtualRealityFilm',
  Other = 'MovingPictureOther',
}

export enum VisualArtType {
  IndividualExhibition = 'IndividualExhibition',
  CollectiveExhibition = 'CollectiveExhibition',
  Installation = 'Installation',
  ArtInPublicSpace = 'ArtInPublicSpace',
  Performance = 'Performance',
  AudioArt = 'AudioArt',
  ArtistBook = 'ArtistBook',
  Other = 'VisualArtsOther',
}

export enum LiteraryArtsType {
  Novel = 'Novel',
  Poetry = 'Poetry',
  Novella = 'Novella',
  ShortFiction = 'ShortFiction',
  Essay = 'Essay',
  Translation = 'Translation',
  Retelling = 'Retelling',
  Play = 'Play',
  Other = 'LiteraryArtsOther',
}
