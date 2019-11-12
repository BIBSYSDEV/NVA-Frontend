export const useMockData = process.env.REACT_APP_USE_MOCK === 'true';
export const SEARCH_RESULTS_PER_PAGE = 10;

export const ORCID_URL = 'https://sandbox.orcid.org/oauth/token/';
export enum API_BASE_URL {
  RESOURCES = 'resources',
  USER = 'user',
}

export enum StatusCode {
  OK = 200,
}
