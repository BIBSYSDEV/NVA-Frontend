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
  FundingSources = '/cristin/funding-sources',
  Keyword = '/cristin/keyword',
  Organization = '/cristin/organization',
  Person = '/cristin/person',
  PersonIdentityNumber = '/cristin/person/identityNumber',
  Position = '/cristin/position',
  Project = '/cristin/project',
}

export enum PublicationChannelApiPath {
  Journal = '/publication-channels-v2/journal',
  Series = '/publication-channels-v2/series',
  Publisher = '/publication-channels-v2/publisher',
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
  Period = '/scientific-index/period',
}

export enum ReportApiPath {
  InstitutionNviApproval = '/report/institution/nvi-approval',
}
