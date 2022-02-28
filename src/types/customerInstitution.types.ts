export interface CustomerInstitution {
  type?: 'Customer';
  id: string;
  archiveName: string;
  cname: string;
  createdDate: string;
  cristinId: string;
  displayName: string;
  feideOrganizationId: string;
  identifier: string;
  institutionDns: string;
  name: string;
  modifiedDate?: string;
  shortName: string;
  vocabularies: CustomerVocabulary[];
  loginMethods: {
    feide: boolean;
    minId: boolean;
    helseId: boolean;
  };
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
  feideOrganizationId: '',
  identifier: '',
  institutionDns: '',
  name: '',
  shortName: '',
  vocabularies: [],
  loginMethods: {
    feide: false,
    minId: false,
    helseId: false,
  },
};

export enum CustomerInstitutionFieldNames {
  ArchiveName = 'archiveName',
  CName = 'cname',
  CristinId = 'cristinId',
  DisplayName = 'displayName',
  FeideOrganizationId = 'feideOrganizationId',
  Identifier = 'identifier',
  InstitutionDns = 'institutionDns',
  LoginMethodFeide = 'loginMethods.feide',
  LoginMethodHelseId = 'loginMethods.helseId',
  LoginMethodMinId = 'loginMethods.minId',
  Name = 'name',
  ShortName = 'shortName',
}

export interface CustomerList {
  customers: CustomerInstitution[];
}

export interface CustomerInstitutionsResponse {
  customers: CustomerInstitution[];
}

export interface VocabularyList {
  type: 'VocabularyList';
  id: string;
  vocabularies: CustomerVocabulary[];
}
