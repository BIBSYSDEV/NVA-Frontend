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
  pages: unknown; // TODO: Remove (NP-9289)
}

export const emptyMediaContributionPublicationInstance: MediaContributionPublicationInstance = {
  type: '',
  pages: {
    type: 'NullPages',
  },
};

export const emptyMediaContributionPublicationContext: MediaContributionPublicationContext = {
  type: PublicationType.MediaContribution,
  format: '',
  medium: '',
  channel: '',
  containerName: '',
  containerSubname: '',
};

export interface MediaContributionPublicationContext {
  type: PublicationType | '';
  format: MediaFormat | '';
  medium: MediaMedium | '';
  // TODO: name of fields below to be determined (NP-9289)
  channel: string;
  containerName: string;
  containerSubname: string;
}

interface MediaContributionReference extends BaseReference {
  publicationContext: MediaContributionPublicationContext;
  publicationInstance: MediaContributionPublicationInstance;
}

export interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: MediaContributionReference;
}
