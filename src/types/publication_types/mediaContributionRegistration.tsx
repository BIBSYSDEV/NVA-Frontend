import { MediaType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';

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
}

interface MediaContributionReference extends BaseReference {
  publicationContext: MediaContributionPublicationContext;
  publicationInstance: MediaContributionPublicationInstance;
}

interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: MediaContributionReference;
}
