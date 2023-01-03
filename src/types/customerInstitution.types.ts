export interface SimpleCustomerInstitution {
  id: string;
  createdDate: string;
  displayName: string;
}

export type PublishStrategy =
  | 'RegistratorPublishesMetadataOnly'
  | 'RegistratorPublishesMetadataAndFiles'
  | 'RegistratorRequiresApprovalForMetadataAndFiles';

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
  doiAgent: {
    id: string;
  };
}

export interface DoiAgent {
  id: string;
  url: string;
  prefix: string;
  username: string;
  password?: string;
}

export interface CustomerInstitutionFormData {
  canAssignDoi: boolean;
  customer: Omit<CustomerInstitution, 'doiAgent'>;
  doiAgent: DoiAgent;
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
};

export const emptyDoiAgent: DoiAgent = {
  id: '',
  url: '',
  prefix: '',
  username: '',
  password: '',
};

export enum CustomerInstitutionFieldNames {
  ArchiveName = 'customer.archiveName',
  CName = 'customer.cname',
  CristinId = 'customer.cristinId',
  DisplayName = 'customer.displayName',
  DoiUrl = 'doiAgent.url',
  DoiUsername = 'doiAgent.username',
  DoiPrefix = 'doiAgent.prefix',
  FeideOrganizationDomain = 'customer.feideOrganizationDomain',
  Identifier = 'customer.identifier',
  InstitutionDns = 'customer.institutionDns',
  Name = 'customer.name',
  RorId = 'customer.rorId',
  ShortName = 'customer.shortName',
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
