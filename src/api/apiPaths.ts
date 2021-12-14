export enum AlmaApiPath {
  Alma = '/alma',
}

export enum AuthorityApiPath {
  Person = '/person',
}

export enum CustomerInstitutionApiPath {
  Customer = '/customer',
}

export enum FileApiPath {
  Abort = '/upload/abort',
  Complete = '/upload/complete',
  Create = '/upload/create',
  Download = '/download',
  ListParts = '/upload/listparts',
  Prepare = '/upload/prepare',
  PublicDownload = '/download/public',
}

export enum InstitutionApiPath {
  Institutions = '/institution/institutions',
  Departments = '/institution/departments',
  Organization = '/cristin-np-3491-more-org-haspart-data/organization/', //TODO
}

export enum ProjectsApiPath {
  Project = '/cristin/project',
}

export enum PublicationChannelApiPath {
  JournalSearch = '/publication-channels/journal',
  PublisherSearch = '/publication-channels/publisher',
}

export enum PublicationsApiPath {
  Registration = '/publication',
  RegistrationsByOwner = '/publication/by-owner',
  DoiLookup = '/doi-fetch',
  DoiRequest = '/publication/doirequest',
  UpdateDoiRequest = '/publication/update-doi-request',
  Messages = '/publication/messages',
}

export enum RoleApiPath {
  InstitutionUsers = '/users-roles/institutions/users',
  Users = '/users-roles/users',
}

export enum SearchApiPath {
  Registrations = '/search/resources',
}
