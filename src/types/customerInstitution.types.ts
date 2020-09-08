import { BackendType } from './publication.types';
import { BackendTypeNames } from './publication_types/commonPublication.types';

export interface CustomerInstitution extends BackendType {
  identifier: string;
  name: string;
  displayName: string;
  shortName: string;
  archiveName: string;
  cname: string;
  institutionDns: string;
  feideOrganizationId: string;
  createdDate: string;
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
  FEIDE_ORGANIZATION_ID = 'feideOrganizationId',
  LOGO_FILE = 'logoFile',
}
