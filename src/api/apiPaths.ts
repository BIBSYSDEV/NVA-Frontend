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

export enum CristinApiPath {
  Organization = '/cristin/organization',
  Person = '/cristin/person',
  PersonIdentityNumer = '/cristin/person/identityNumber',
  Position = '/cristin/position?active=true',
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
  Login = '/users-roles/login',
  Users = '/users-roles/users',
}

export enum SearchApiPath {
  Registrations = '/search/resources',
  Worklist = '/search/worklist',
}
