export interface CustomerInstitution {
  id: string;
  name: string;
  displayName: string;
  shortName: string;
  archiveName: string;
  CNAME: string;
  institutionDNS: string;
  administrationId: string;
  feideOrganizationId: string;
  createdDate: string;
  contact: string;
}

export const emptyCustomerInstitution: CustomerInstitution = {
  id: '',
  name: '',
  displayName: '',
  shortName: '',
  archiveName: '',
  CNAME: '',
  institutionDNS: '',
  administrationId: '',
  feideOrganizationId: '',
  contact: '',
  createdDate: '',
};

export enum CustomerInstitutionFieldNames {
  NAME = 'name',
  DISPLAY_NAME = 'displayName',
  SHORT_NAME = 'shortName',
  ARCHIVE_NAME = 'archiveName',
  CNAME = 'CNAME',
  INSTITUTION_DNS = 'institutionDNS',
  ADMINISTRATION_ID = 'administrationId',
  FEIDE_ORGANIZATION_ID = 'feideOrganizationId',
}
