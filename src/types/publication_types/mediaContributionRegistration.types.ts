import { MediaType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';
import { JournalPublicationContext, JournalPublicationInstance } from './journalRegistration.types';

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
  medium: '',
  disseminationChannel: '',
  partOf: {
    series: '',
    seriesPart: '',
  },
};

export const emptyMediaContributionPeriodicalPublicationContext: MediaContributionPeriodicalPublicationContext = {
  type: 'MediaContributionPeriodical',
  id: '',
};

export interface MediaContributionPublicationContext {
  type: PublicationType | '';
  format: MediaFormat | '';
  medium: MediaMedium | '';
  disseminationChannel: string;
  partOf?: {
    series: string;
    seriesPart: string;
  };
}

interface MediaContributionPeriodicalPublicationContext extends Omit<JournalPublicationContext, 'type'> {
  type: 'MediaContributionPeriodical' | 'UnconfirmedMediaContributionPeriodical';
}

interface MediaContributionPeriodicalPublicationInstance
  extends Omit<JournalPublicationInstance, 'type' | 'corrigendumFor'> {
  type: MediaType.MediaFeatureArticle | MediaType.MediaReaderOpinion;
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

export interface MediaRegistration extends BaseRegistration {
  entityDescription: MediaContributionEntityDescription;
}
