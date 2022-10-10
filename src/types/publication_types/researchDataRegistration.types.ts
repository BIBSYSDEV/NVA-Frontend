import { PublicationType, ResearchDataType } from '../publicationFieldNames';
import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  ContextPublisher,
  emptyContextPublisher,
} from '../registration.types';

export interface ResearchDataRegistration extends BaseRegistration {
  entityDescription: ResearchDataEntityDescription;
}

export interface ResearchDataPublicationInstance
  extends DataManagementPlanPublicationInstance,
    DatasetPublicationInstance {
  type: ResearchDataType | '';
}

export const emptyResearchDataPublicationInstance: ResearchDataPublicationInstance = {
  type: '',
  related: [],
  agreesWithTermsAndConditions: false,
  geographicalCoverage: {
    type: 'GeographicalDescription',
    description: '',
  },
  referencedBy: [],
  compliesWith: [],
};

export const emptyResearchDataPublicationContext: ResearchDataPublicationContext = {
  type: PublicationType.ResearchData,
  publisher: emptyContextPublisher,
};

export interface ResearchDataPublicationContext extends DataManagementPlanPublicationContext {
  type: PublicationType.ResearchData;
}

interface ResearchDataContributionReference extends BaseReference {
  publicationContext: ResearchDataPublicationContext;
  publicationInstance: ResearchDataPublicationInstance;
}

export interface ResearchDataEntityDescription extends BaseEntityDescription {
  reference: ResearchDataContributionReference;
}

interface DataManagementPlanPublicationInstance {
  related: string[];
}

interface DataManagementPlanPublicationContext {
  publisher: ContextPublisher;
}

interface DatasetPublicationInstance {
  agreesWithTermsAndConditions: boolean;
  geographicalCoverage: GeographicalDescription;
  compliesWith: string[]; // Related DMPs
  referencedBy: string[]; // Related Registrations (not DMPs)
  related: string[]; // External links
}

interface GeographicalDescription {
  type: 'GeographicalDescription';
  description: string;
}
