import { allPublicationInstanceTypes } from './publicationFieldNames';
import { PublicationInstanceType } from './registration.types';

export interface SimpleCustomerInstitution {
  active: boolean;
  id: string;
  createdDate: string;
  displayName: string;
  doiPrefix?: string;
}

export type PublishStrategy = 'RegistratorPublishesMetadataOnly' | 'RegistratorPublishesMetadataAndFiles';

export enum Sector {
  Uhi = 'UHI',
  Health = 'HEALTH',
  Institute = 'INSTITUTE',
  Abm = 'ABM',
  Other = 'OTHER',
}

export interface CustomerInstitution
  extends Pick<SimpleCustomerInstitution, 'id' | 'createdDate' | 'displayName' | 'active'> {
  type?: 'Customer';
  archiveName: string;
  cristinId: string;
  feideOrganizationDomain: string;
  identifier: string;
  institutionDns: string;
  name: string;
  modifiedDate?: string;
  vocabularies: CustomerVocabulary[];
  publicationWorkflow: PublishStrategy;
  rorId?: string;
  doiAgent: DoiAgent;
  sector: Sector;
  inactiveFrom?: string;
  serviceCenter?: { uri: string };
  nviInstitution: boolean;
  rboInstitution: boolean;
  rightsRetentionStrategy: {
    type: CustomerRrsType;
    id: string;
  };
  generalSupportEnabled: boolean;
  allowFileUploadForTypes: PublicationInstanceType[];
}

export enum CustomerRrsType {
  NullRightsRetentionStrategy = 'NullRightsRetentionStrategy',
  RightsRetentionStrategy = 'RightsRetentionStrategy',
  OverridableRightsRetentionStrategy = 'OverridableRightsRetentionStrategy',
}

export interface DoiAgent {
  id: string;
  prefix: string;
  username: string;
}

export interface ProtectedDoiAgent extends DoiAgent {
  password?: string;
}

export interface CustomerInstitutionFormData {
  canAssignDoi: boolean;
  customer: Omit<CustomerInstitution, 'doiAgent'>;
  doiAgent: ProtectedDoiAgent;
}

export enum VocabularyStatus {
  Default = 'Default',
  Allowed = 'Allowed',
  Disabled = 'Disabled',
}

export const visibleVocabularyStatuses = [VocabularyStatus.Default, VocabularyStatus.Allowed];

export interface CustomerVocabulary {
  type: 'Vocabulary';
  id: string;
  name: string;
  status: VocabularyStatus;
}

export const defaultHrcsActivity: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/activity',
  status: VocabularyStatus.Disabled,
  name: 'HRCS Activity',
};

export const defaultHrcsCategory: CustomerVocabulary = {
  type: 'Vocabulary',
  id: 'https://nva.unit.no/hrcs/category',
  status: VocabularyStatus.Disabled,
  name: 'HRCS Category',
};

export const emptyCustomerInstitution: Omit<CustomerInstitution, 'doiAgent'> = {
  active: true,
  type: 'Customer',
  id: '',
  archiveName: '',
  createdDate: '',
  cristinId: '',
  displayName: '',
  feideOrganizationDomain: '',
  identifier: '',
  institutionDns: '',
  name: '',
  vocabularies: [],
  publicationWorkflow: 'RegistratorPublishesMetadataAndFiles',
  rorId: '',
  sector: Sector.Uhi,
  nviInstitution: false,
  rboInstitution: false,
  rightsRetentionStrategy: { type: CustomerRrsType.NullRightsRetentionStrategy, id: '' },
  allowFileUploadForTypes: allPublicationInstanceTypes,
  generalSupportEnabled: true,
};

export const emptyProtectedDoiAgent: ProtectedDoiAgent = {
  id: '',
  prefix: '',
  username: '',
  password: undefined,
};

export enum CustomerInstitutionFieldNames {
  ArchiveName = 'customer.archiveName',
  CristinId = 'customer.cristinId',
  DisplayName = 'customer.displayName',
  DoiUsername = 'doiAgent.username',
  DoiPassword = 'doiAgent.password',
  DoiPrefix = 'doiAgent.prefix',
  FeideOrganizationDomain = 'customer.feideOrganizationDomain',
  Identifier = 'customer.identifier',
  InactiveFrom = 'customer.inactiveFrom',
  InstitutionDns = 'customer.institutionDns',
  Name = 'customer.name',
  RorId = 'customer.rorId',
  Sector = 'customer.sector',
  NviInstitution = 'customer.nviInstitution',
  CanAssignDoi = 'canAssignDoi',
  RboInstitution = 'customer.rboInstitution',
}

export interface CustomerList {
  customers: SimpleCustomerInstitution[];
}

export interface VocabularyList {
  type: 'VocabularyList';
  id: string;
  vocabularies: CustomerVocabulary[];
}
