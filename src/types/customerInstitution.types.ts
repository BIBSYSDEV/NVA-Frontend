import { BackendType, BackendTypeNames } from './publication.types';

export interface CustomerInstitution extends BackendType {
  identifier: string;
  name: string;
  displayName: string;
  shortName: string;
  archiveName: string;
  cname: string;
  institutionDns: string;
  administrationId: string;
  feideOrganizationId: string;
  createdDate: string;
  logoFile?: File;
  error?: string;
}

export const emptyCustomerInstitution: CustomerInstitution = {
  type: BackendTypeNames.CUSTOMER,
  identifier: '',
  name: '',
  displayName: '',
  shortName: '',
  archiveName: '',
  cname: '',
  institutionDns: '',
  administrationId: '',
  feideOrganizationId: '',
  createdDate: '',
};

export enum CustomerInstitutionFieldNames {
  IDENTIFIER = 'identifier',
  NAME = 'name',
  DISPLAY_NAME = 'displayName',
  SHORT_NAME = 'shortName',
  ARCHIVE_NAME = 'archiveName',
  CNAME = 'cname',
  INSTITUTION_DNS = 'institutionDns',
  ADMINISTRATION_ID = 'administrationId',
  FEIDE_ORGANIZATION_ID = 'feideOrganizationId',
  LOGO_FILE = 'logoFile',
}
