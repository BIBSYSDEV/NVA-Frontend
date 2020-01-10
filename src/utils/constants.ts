export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';

export const SEARCH_RESULTS_PER_PAGE = 10;
export const MINIMUM_SEARCH_CHARACTERS = 3;
export const DEBOUNCE_INTERVAL = 500;
export const MAX_NOTIFICATIONS = 3;
export const APP_VERSION = '3';

export const ORCID_BASE_URL = process.env.REACT_APP_ORCID_BASE_URL;
export const ORCID_USER_INFO_URL = '/oauth/userinfo';
export const ORCID_SIGN_IN_URL = `${ORCID_BASE_URL}/signin?oauth&client_id=${process.env.REACT_APP_ORCID_CLIENT_ID}&response_type=token&scope=openid&redirect_uri=${process.env.REACT_APP_ORCID_REDIRECT_URI}`;

export const AUTHORITY_REGISTER_API_URL = process.env.REACT_APP_AUTHORITY_REGISTER_API_URL;
export const ALMA_API_URL = process.env.REACT_APP_ALMA_API_URL;
export const CRISTIN_API_URL = process.env.REACT_APP_CRISTIN_API_URL;

export const API_URL = process.env.REACT_APP_API_URL;
const API_TOKEN_KEY = process.env.REACT_APP_API_TOKEN_KEY;
export const API_TOKEN = API_TOKEN_KEY ? localStorage.getItem(API_TOKEN_KEY) : '';

export enum ApiServiceUrl {
  PUBLICATIONS = 'publications',
  DOI_LOOKUP = 'doilookup',
  USER = 'user',
  PROJECT = 'cristin-project',
}

export enum StatusCode {
  OK = 200,
}

export enum PublicationTableNumber {
  PUBLISHERS = 850,
  PUBLICATION_CHANNELS = 851,
}
