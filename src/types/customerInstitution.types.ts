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
};

export enum CustomerInstitutionFieldNames {
  ArchiveName = 'archiveName',
  CName = 'cname',
  CristinId = 'cristinId',
  DisplayName = 'displayName',
  FeideOrganizationId = 'feideOrganizationId',
  Identifier = 'identifier',
  InstitutionDns = 'institutionDns',
  Name = 'name',
  ShortName = 'shortName',
}

export interface CustomerList {
  customers: CustomerInstitution[];
}

export interface CustomerInstitutionsResponse {
  customers: CustomerInstitution[];
}
