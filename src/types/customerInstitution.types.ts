import { BackendType } from './registration.types';
import { BackendTypeNames } from './publication_types/commonPublication.types';

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
  ARCHIVE_NAME = 'archiveName',
  CNAME = 'cname',
  CRISTIN_ID = 'cristinId',
  DISPLAY_NAME = 'displayName',
  FEIDE_ORGANIZATION_ID = 'feideOrganizationId',
  IDENTIFIER = 'identifier',
  INSTITUTION_DNS = 'institutionDns',
  NAME = 'name',
  SHORT_NAME = 'shortName',
}

export interface CustomerList {
  customers: CustomerInstitution[];
}
