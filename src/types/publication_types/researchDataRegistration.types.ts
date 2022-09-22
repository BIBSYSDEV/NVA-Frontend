import { PublicationType, ResearchDataType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration } from '../registration.types';

export interface ResearchDataRegistration extends BaseRegistration {
  entityDescription: MediaContributionEntityDescription;
}

export interface ResearchDataPublicationInstance {
  type: ResearchDataType | '';
}

export const emptyResearchDataPublicationInstance: ResearchDataPublicationInstance = {
  type: '',
};

export const emptyResearchDataPublicationContext: ResearchDataPublicationContext = {
  type: PublicationType.ResearchData,
};

export interface ResearchDataPublicationContext {
  type: PublicationType.ResearchData;
}

interface ResearchDataContributionReference extends BaseReference {
  publicationContext: ResearchDataPublicationContext;
  publicationInstance: ResearchDataPublicationInstance;
}

export interface MediaContributionEntityDescription extends BaseEntityDescription {
  reference: ResearchDataContributionReference;
}
