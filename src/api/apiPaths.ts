export enum CustomerInstitutionApiPath {
  Customer = '/customer',
}

export enum FileApiPath {
  Abort = '/upload/abort',
  Complete = '/upload/complete',
  Create = '/upload/create',
  ListParts = '/upload/listparts',
  Prepare = '/upload/prepare',
}

export enum CristinApiPath {
  FundingSources = '/cristin/funding-sources',
  Keyword = '/cristin/keyword',
  Organization = '/cristin/organization',
  Person = '/cristin/person',
  PersonIdentityNumber = '/cristin/person/identityNumber',
  Position = '/cristin/position',
  Project = '/cristin/project',
}

export enum PublicationChannelApiPath {
  Publisher = '/publication-channels-v2/publisher',
  SerialPublication = '/publication-channels-v2/serial-publication',
}

export enum PublicationsApiPath {
  Registration = '/publication',
  RegistrationsByOwner = '/publication/by-owner',
  DoiLookup = '/doi-fetch/preview',
  ImportCandidate = '/publication/import-candidate',
}

export enum OrcidApiPath {
  Orcid = '/orcid',
}

export enum RoleApiPath {
  InstitutionUsers = '/users-roles/institutions/users',
  Login = '/users-roles/login',
  Users = '/users-roles/users',
}

export enum SearchApiPath {
  CustomerRegistrations = '/search/customer/resources',
  Registrations = '/search/resources',
  RegistrationsExport = '/search/resources/export',
  CustomerTickets = '/search/customer/tickets',
  ImportCandidates = '/search/customer/import-candidates',
  NviCandidate = '/scientific-index/candidate',
}

export enum VerifiedFundingApiPath {
  Nfr = '/verified-funding/nfr',
}

export enum PersonPreferencesApiPath {
  PersonPreferences = '/person-preferences',
}

export enum ScientificIndexApiPath {
  Candidate = '/scientific-index/candidate',
  CandidateForRegistration = '/scientific-index/candidate/publication',
  InstitutionApprovalReport = '/scientific-index/institution-approval-report',
  InstitutionReport = '/scientific-index/institution-report',
  Period = '/scientific-index/period',
  Publication = '/scientific-index/publication',
}
