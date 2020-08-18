export enum BackendTypeNames {
  APPROVAL = 'Approval',
  CONTRIBUTOR = 'Contributor',
  CUSTOMER = 'Customer',
  ENTITY_DESCRIPTION = 'EntityDescription',
  FILE = 'File',
  FILE_SET = 'FileSet',
  GRANT = 'Grant',
  IDENTITY = 'Identity',
  LICENSE = 'License',
  ORGANIZATION = 'Organization',
  PAGES_MONOGRAPH = 'MonographPages',
  PAGES_RANGE = 'Range',
  PUBLICATION = 'Publication',
  PUBLICATION_DATE = 'PublicationDate',
  REFERENCE = 'Reference',
  RESEARCH_PROJECT = 'ResearchProject',
}

export const emptyDate = {
  type: BackendTypeNames.PUBLICATION_DATE,
  year: '',
  month: '',
  day: '',
};
