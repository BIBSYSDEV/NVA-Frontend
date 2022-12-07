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
  doiAgent?: DoiAgent;
}

export interface DoiAgent {
  name: string;
  prefix: string;
}

export interface CustomerInstitutionFormData extends CustomerInstitution {
  canAssignDoi: boolean;
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

export const emptyCustomerInstitution: CustomerInstitution = {
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
  doiAgent: {
    name: '',
    prefix: '',
  },
};

export enum CustomerInstitutionFieldNames {
  ArchiveName = 'archiveName',
  CName = 'cname',
  CristinId = 'cristinId',
  DisplayName = 'displayName',
  DoiName = 'doiAgent.name',
  DoiPrefix = 'doiAgent.prefix',
  FeideOrganizationDomain = 'feideOrganizationDomain',
  Identifier = 'identifier',
  InstitutionDns = 'institutionDns',
  Name = 'name',
  RorId = 'rorId',
  ShortName = 'shortName',
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
