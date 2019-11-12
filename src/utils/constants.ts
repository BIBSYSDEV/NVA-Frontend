export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';
export const SEARCH_RESULTS_PER_PAGE = 10;
export const ORCID_URL = 'https://sandbox.orcid.org/oauth/token/';

export enum ApiBaseUrl {
  RESOURCES = 'resources',
  USER = 'user',
}

export enum StatusCode {
  OK = 200,
}
