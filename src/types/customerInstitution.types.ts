export interface CustomerInstitution {
  id: string;
  name: string;
  displayName: string;
  shortName: string;
  archiveName: string;
  cname: string;
  institutionDns: string;
  administrationId: string;
  feideOrganizationId: string;
  createdDate: string;
  contact: string;
  logoFile?: File;
  error?: string;
}

export const emptyCustomerInstitution: CustomerInstitution = {
  id: '',
  name: '',
  displayName: '',
  shortName: '',
  archiveName: '',
  cname: '',
  institutionDns: '',
  administrationId: '',
  feideOrganizationId: '',
  contact: '',
  createdDate: '',
};

export enum CustomerInstitutionFieldNames {
  ID = 'id',
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
