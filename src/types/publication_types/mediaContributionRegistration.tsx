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
  pages: any;
}

export const emptyMediaContributionPublicationInstance: MediaContributionPublicationInstance = {
  type: '',
  pages: {
    type: 'NullPages',
  },
};

interface MediaContributionPublicationContext {
  type: PublicationType | '';
  format: MediaFormat | '';
  medium: MediaMedium | '';
}

interface MediaContributionReference extends BaseReference {
  publicationContext: MediaContributionPublicationContext;
  publicationInstance: MediaContributionPublicationInstance;
}

interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: MediaContributionReference;
}
