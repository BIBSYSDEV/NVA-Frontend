import { BackendType } from './registration.types';
import { BackendTypeNames } from './publication_types/commonRegistration.types';

export interface CustomerInstitution extends Partial<BackendType> {
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
  type: BackendTypeNames.CUSTOMER,
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
