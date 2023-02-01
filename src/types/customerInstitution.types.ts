export interface SimpleCustomerInstitution {
  id: string;
  createdDate: string;
  displayName: string;
}

export type PublishStrategy =
  | 'RegistratorPublishesMetadataOnly'
  | 'RegistratorPublishesMetadataAndFiles'
  | 'RegistratorRequiresApprovalForMetadataAndFiles';

export enum Sector {
  Uhi = 'UHI',
  Health = 'HEALTH',
  Institute = 'INSTITUTE',
}

export interface CustomerInstitution extends SimpleCustomerInstitution {
  type?: 'Customer';
  archiveName: string;
  cname: string;
  cristinId: string;
  feideOrganizationDomain: string;
  identifier: string;
  institutionDns: string;
  name: string;
  modifiedDate?: string;
  shortName: string;
  vocabularies: CustomerVocabulary[];
  publicationWorkflow: PublishStrategy;
  rorId?: string;
  doiAgent: DoiAgent;
  sector: Sector;
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

export interface CustomerVocabulary {
  type: 'Vocabulary';
  id: string;
  name: string;
  status: VocabularyStatus;
}

export const emptyCustomerInstitution: Omit<CustomerInstitution, 'doiAgent'> = {
  type: 'Customer',
  id: '',
  archiveName: '',
  cname: '',
  createdDate: '',
  cristinId: '',
  displayName: '',
  feideOrganizationDomain: '',
  identifier: '',
  institutionDns: '',
  name: '',
  shortName: '',
  vocabularies: [],
  publicationWorkflow: 'RegistratorPublishesMetadataAndFiles',
  rorId: '',
  sector: Sector.Uhi,
};

export const emptyProtectedDoiAgent: ProtectedDoiAgent = {
  id: '',
  prefix: '',
  username: '',
  password: undefined,
};

export enum CustomerInstitutionFieldNames {
  ArchiveName = 'customer.archiveName',
  CName = 'customer.cname',
  CristinId = 'customer.cristinId',
  DisplayName = 'customer.displayName',
  DoiUsername = 'doiAgent.username',
  DoiPassword = 'doiAgent.password',
  DoiPrefix = 'doiAgent.prefix',
  FeideOrganizationDomain = 'customer.feideOrganizationDomain',
  Identifier = 'customer.identifier',
  InstitutionDns = 'customer.institutionDns',
  Name = 'customer.name',
  RorId = 'customer.rorId',
  ShortName = 'customer.shortName',
  Sector = 'customer.sector',
  CanAssignDoi = 'canAssignDoi',
}

export interface CustomerList {
  customers: SimpleCustomerInstitution[];
}

export interface VocabularyList {
  type: 'VocabularyList';
  id: string;
  vocabularies: CustomerVocabulary[];
}
