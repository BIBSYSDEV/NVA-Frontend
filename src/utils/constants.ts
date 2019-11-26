export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';

export const SEARCH_RESULTS_PER_PAGE = 10;
export const MAX_NOTIFICATIONS = 3;

export const ORCID_OAUTH_URL = `${process.env.REACT_APP_ORCID_BASE_URL}/oauth/token/`;
export const ORCID_SIGN_IN_URL = `${process.env.REACT_APP_ORCID_BASE_URL}/signin?oauth&client_id=${process.env.REACT_APP_ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${process.env.REACT_APP_ORCID_REDIRECT_URI}`;

export enum ApiBaseUrl {
  RESOURCES = 'resources',
  DOI_LOOKUP = 'doilookup',
  USER = 'user',
  AUTHORITY_REGISTER_EXTERNAL = 'https://utvikle-a.bibsys.no/authority/rest',
  VIAF_EXTERNAL = 'http://www.viaf.org/viaf',
}

export enum StatusCode {
  OK = 200,
}
