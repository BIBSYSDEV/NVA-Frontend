export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';

export const SEARCH_RESULTS_PER_PAGE = 10;
export const MINIMUM_SEARCH_CHARACTERS = 3;
export const DEBOUNCE_INTERVAL_INPUT = 500;
export const DEBOUNCE_INTERVAL_MODAL = 5000;

export const ORCID_BASE_URL = process.env.REACT_APP_ORCID_BASE_URL;
export const ORCID_USER_INFO_URL = `${ORCID_BASE_URL}/oauth/userinfo`;
export const ORCID_SIGN_IN_URL = `${ORCID_BASE_URL}/signin?oauth&client_id=${process.env.REACT_APP_ORCID_CLIENT_ID}&response_type=token&scope=openid&redirect_uri=${process.env.REACT_APP_ORCID_REDIRECT_URI}`;

export const ALMA_API_URL = process.env.REACT_APP_ALMA_API_URL;

export const API_URL = process.env.REACT_APP_API_URL;

export enum StatusCode {
  OK = 200,
  NO_CONTENT = 204,
}

export enum PublicationTableNumber {
  PUBLISHERS = 850,
  PUBLICATION_CHANNELS = 851,
}
