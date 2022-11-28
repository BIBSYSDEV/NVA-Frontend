import { MediaType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, PublicationChannelType } from '../registration.types';
import { JournalPublicationContext, JournalPublicationInstance } from './journalRegistration.types';
import { emptyPagesRange } from './pages.types';

export enum MediaFormat {
  Text = 'Text',
  Sound = 'Sound',
  Video = 'Video',
}

export enum MediaMedium {
  Journal = 'Journal',
  Radio = 'Radio',
  TV = 'TV',
  Internet = 'Internet',
  Other = 'Other',
}

export interface MediaContributionPublicationInstance {
  type: MediaType | '';
}

export const emptyMediaContributionPublicationInstance: MediaContributionPublicationInstance = {
  type: '',
};

export const emptyMediaContributionPublicationContext: MediaContributionPublicationContext = {
  type: PublicationType.MediaContribution,
  format: '',
  medium: {
    type: '',
  },
  disseminationChannel: '',
  partOf: {
    type: 'SeriesEpisode',
    series: '',
    seriesPart: '',
  },
};

export const emptyMediaContributionPeriodicalPublicationContext: MediaContributionPeriodicalPublicationContext = {
  type: PublicationChannelType.UnconfirmedMediaContributionPeriodical,
  id: '',
};

export const emptyMediaContributionPeriodicalPublicationInstance: MediaContributionPeriodicalPublicationInstance = {
  type: '',
  articleNumber: '',
  issue: '',
  pages: emptyPagesRange,
  volume: '',
};

export interface MediaContributionPublicationContext {
  type: PublicationType | '';
  format: MediaFormat | '';
  medium: {
    type: MediaMedium | '';
    description?: string;
  };
  disseminationChannel: string;
  partOf?: {
    type: 'SeriesEpisode';
    series: string;
    seriesPart: string;
  };
}

export interface MediaContributionPeriodicalPublicationContext extends Omit<JournalPublicationContext, 'type'> {
  type:
    | PublicationChannelType.MediaContributionPeriodical
    | PublicationChannelType.UnconfirmedMediaContributionPeriodical;
}

export interface MediaContributionPeriodicalPublicationInstance
  extends Omit<JournalPublicationInstance, 'type' | 'corrigendumFor' | 'contentType' | 'peerReviewed'> {
  type: MediaType.MediaFeatureArticle | MediaType.MediaReaderOpinion | '';
}

interface MediaContributionReference extends BaseReference {
  publicationContext: MediaContributionPublicationContext;
  publicationInstance: MediaContributionPublicationInstance;
}

interface MediaContributionPeriodical extends BaseReference {
  publicationContext: MediaContributionPeriodicalPublicationContext;
  publicationInstance: MediaContributionPeriodicalPublicationInstance;
}

export interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: MediaContributionReference | MediaContributionPeriodical;
}
