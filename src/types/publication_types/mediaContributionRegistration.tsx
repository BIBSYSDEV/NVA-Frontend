import { MediaType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';

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

export interface MediaContributionRegistration extends BaseRegistration {
  entityDescription: MediaContributionEntityDescription;
}

interface MediaContributionPublicationInstance {
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

interface MediaContributionReference extends BaseReference {
  publicationContext: MediaContributionPublicationContext;
  publicationInstance: MediaContributionPublicationInstance;
}

export interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: MediaContributionReference;
}
