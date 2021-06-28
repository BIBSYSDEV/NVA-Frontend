export enum AlmaApiPaths {
  ALMA = '/alma',
}

export enum AuthorityApiPaths {
  PERSON = '/person',
}

export enum CustomerInstitutionApiPaths {
  CUSTOMER_INSTITUTION = '/customer',
}

export enum FileApiPaths {
  ABORT = '/upload/abort',
  COMPLETE = '/upload/complete',
  CREATE = '/upload/create',
  DOWNLOAD = '/download',
  LIST_PARTS = '/upload/listparts',
  PREPARE = '/upload/prepare',
  PUBLIC_DOWNLOAD = '/download/public',
}

export enum InstitutionApiPaths {
  INSTITUTIONS = '/institution/institutions',
  DEPARTMENTS = '/institution/departments',
}

export enum ProjectsApiPaths {
  PROJECT = '/project',
}

export enum PublicationChannelApiPaths {
  SEARCH = '/channel/search',
}

export enum PublicationsApiPaths {
  PUBLICATION = '/publication',
  PUBLICATIONS_BY_OWNER = '/publication/by-owner',
  DOI_LOOKUP = '/doi-fetch',
  DOI_REQUEST = '/publication/doirequest',
  UPDATE_DOI_REQUEST = '/publication/update-doi-request',
  MESSAGES = '/publication/messages',
}

export enum RoleApiPaths {
  INSTITUTION_USERS = '/users-roles/institutions/users',
  USERS = '/users-roles/users',
}

export enum SearchApiPaths {
  REGISTRATIONS = '/search/resources',
}
