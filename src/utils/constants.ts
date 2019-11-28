export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';

export const SEARCH_RESULTS_PER_PAGE = 10;
export const MINIMUM_SEARCH_CHARACTERS = 3;
export const DEBOUNCE_INTERVAL = 500;
export const MAX_NOTIFICATIONS = 3;

export const ORCID_OAUTH_URL = `${process.env.REACT_APP_ORCID_BASE_URL}/oauth/token/`;
export const ORCID_SIGN_IN_URL = `${process.env.REACT_APP_ORCID_BASE_URL}/signin?oauth&client_id=${process.env.REACT_APP_ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${process.env.REACT_APP_ORCID_REDIRECT_URI}`;

export const PUBLICATION_CHANNEL_API_URL = process.env.REACT_APP_PUBLICATION_CHANNEL_API_URL;
export const AUTHORITY_REGISTER_API_URL = process.env.REACT_APP_AUTHORITY_REGISTER_API_URL;
export const CRISTIN_API_URL = process.env.REACT_APP_CRISTIN_API_URL;

export enum ApiBaseUrl {
  RESOURCES = 'resources',
  DOI_LOOKUP = 'doilookup',
  USER = 'user',
}

export enum StatusCode {
  OK = 200,
}
