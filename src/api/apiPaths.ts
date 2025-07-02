export enum CustomerInstitutionApiPath {
  ChannelClaims = '/customer/channel-claims',
  ChannelClaim = '/customer/channel-claim',
  Customer = '/customer',
}

export enum FileApiPath {
  Abort = '/file-upload/abort',
  Complete = '/file-upload/complete',
  Create = '/file-upload/create',
  ListParts = '/file-upload/listparts',
  Prepare = '/file-upload/prepare',
}

export enum CristinApiPath {
  FundingSources = '/cristin/funding-sources',
  Keyword = '/cristin/keyword',
  Organization = '/cristin/organization',
  Person = '/cristin/person',
  PersonIdentityNumber = '/cristin/person/identityNumber',
  Position = '/cristin/position',
  Project = '/cristin/project',
  ProjectCategories = '/cristin/category/project',
}

export enum PublicationChannelApiPath {
  Publisher = '/publication-channels-v2/publisher',
  SerialPublication = '/publication-channels-v2/serial-publication',
}

export enum PublicationsApiPath {
  Registration = '/publication',
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
  CustomerTickets = '/search/customer/tickets',
  ImportCandidates = '/search/customer/import-candidates',
  MyRegistrations = '/search/user/resources',
  NviCandidate = '/scientific-index/candidate',
  Registrations = '/search/resources',
  RegistrationsExport = '/search/resources/export',
}

export enum VerifiedFundingApiPath {
  Nfr = '/verified-funding/nfr',
}

export enum PersonPreferencesApiPath {
  PersonPreferences = '/person-preferences',
}

export enum ScientificIndexApiPath {
  Candidate = '/scientific-index/candidate',
  InstitutionApprovalReport = '/scientific-index/institution-approval-report',
  InstitutionReport = '/scientific-index/institution-report',
  Period = '/scientific-index/period',
  Publication = '/scientific-index/publication',
}
