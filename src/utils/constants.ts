export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';
export const SEARCH_RESULTS_PER_PAGE = 10;
export const ORCID_OAUTH_URL = `${process.env.REACT_APP_ORCID_BASE_URL}/oauth/token/`;
export const ORCID_SIGN_IN_URL = `${process.env.REACT_APP_ORCID_BASE_URL}/signin?oauth&client_id=${process.env.REACT_APP_ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${process.env.REACT_APP_ORCID_REDIRECT_URI}`;

export enum ApiBaseUrl {
  RESOURCES = 'resources',
  USER = 'user',
  CRISTIN_EXTERNAL = 'https://api.cristin.no/v2',
}

export enum StatusCode {
  OK = 200,
}
