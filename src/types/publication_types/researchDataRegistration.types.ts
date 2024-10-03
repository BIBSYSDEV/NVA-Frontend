import { PublicationType, ResearchDataType } from '../publicationFieldNames';
import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  ContextPublisher,
  PublicationChannelType,
  RelatedDocument,
} from '../registration.types';

export interface ResearchDataRegistration extends BaseRegistration {
  entityDescription: ResearchDataEntityDescription;
}

export interface ResearchDataPublicationInstance
  extends Partial<DataManagementPlanPublicationInstance>,
    Partial<DatasetPublicationInstance> {
  type: ResearchDataType | '';
}

export const emptyResearchDataPublicationInstance: ResearchDataPublicationInstance = {
  type: '',
  related: [],
  userAgreesToTermsAndConditions: false,
  geographicalCoverage: {
    type: 'GeographicalDescription',
    description: '',
  },
  referencedBy: [],
  compliesWith: [],
};

export const emptyResearchDataPublicationContext: ResearchDataPublicationContext = {
  type: PublicationType.ResearchData,
  publisher: {
    type: PublicationChannelType.UnconfirmedPublisher,
    id: '',
  },
};

export interface ResearchDataPublicationContext {
  type: PublicationType.ResearchData;
  publisher?: ContextPublisher;
}

interface ResearchDataContributionReference extends BaseReference {
  publicationContext: ResearchDataPublicationContext;
  publicationInstance: ResearchDataPublicationInstance;
}

export interface ResearchDataEntityDescription extends BaseEntityDescription {
  reference: ResearchDataContributionReference;
}

interface DataManagementPlanPublicationInstance {
  related: RelatedDocument[]; // Related Registrations and external links
}

interface DatasetPublicationInstance {
  userAgreesToTermsAndConditions: boolean;
  geographicalCoverage: GeographicalDescription;
  compliesWith: string[]; // Related DMPs
  referencedBy: string[]; // Related Registrations (not DMPs)
  related: RelatedDocument[]; // External links
}

interface GeographicalDescription {
  type: 'GeographicalDescription';
  description: string;
}
