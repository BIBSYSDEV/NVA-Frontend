import { PublicationType, ResearchDataType } from '../publicationFieldNames';
import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  ContextPublisher,
  emptyContextPublisher,
} from '../registration.types';

export interface ResearchDataRegistration extends BaseRegistration {
  entityDescription: MediaContributionEntityDescription;
}

export interface ResearchDataPublicationInstance {
  type: ResearchDataType | '';
  related: string[];
}

export const emptyResearchDataPublicationInstance: ResearchDataPublicationInstance = {
  type: '',
  related: [],
};

export const emptyResearchDataPublicationContext: ResearchDataPublicationContext = {
  type: PublicationType.ResearchData,
  publisher: emptyContextPublisher,
};

export interface ResearchDataPublicationContext {
  type: PublicationType.ResearchData;
  publisher: ContextPublisher;
}

interface ResearchDataContributionReference extends BaseReference {
  publicationContext: ResearchDataPublicationContext;
  publicationInstance: ResearchDataPublicationInstance;
}

export interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: ResearchDataContributionReference;
}
