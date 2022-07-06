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
  Tv = 'TV',
  Internet = 'Internet',
  Other = 'Other',
}

export interface MediaContributionRegistration extends BaseRegistration {
  entityDescription: MediaContributionEntityDescription;
}

interface MediaContributionPublicationInstance {
  type: MediaType | '';
  pages: any; // TODO: Remove
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

interface MediaContributionPublicationContext {
  type: PublicationType | '';
  format: MediaFormat | '';
  medium: MediaMedium | '';
  channel: string;
  containerName: string;
  containerSubname: string;
}

interface MediaContributionReference extends BaseReference {
  publicationContext: MediaContributionPublicationContext;
  publicationInstance: MediaContributionPublicationInstance;
}

interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: MediaContributionReference;
}
