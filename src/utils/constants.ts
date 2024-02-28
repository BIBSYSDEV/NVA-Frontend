export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
export const DEBOUNCE_INTERVAL_INPUT = 1000;

export const ORCID_BASE_URL = process.env.REACT_APP_ORCID_BASE_URL;
export const ORCID_USER_INFO_URL = `${ORCID_BASE_URL}/oauth/userinfo`;

const apiHostEnv = process.env.REACT_APP_API_HOST;
const apiHostUrlObject = apiHostEnv
  ? apiHostEnv.startsWith('http')
    ? new URL(apiHostEnv.replace('http://', 'https://'))
    : new URL(`https://${apiHostEnv}`)
  : '';
export const API_URL = apiHostUrlObject.toString();

export const hrcsActivityBaseId = 'https://nva.unit.no/hrcs/activity';
export const hrcsCategoryBaseId = 'https://nva.unit.no/hrcs/category';

export const isErrorStatus = (status: number) => status >= 400 && status <= 599;
export const isSuccessStatus = (status: number) => status >= 200 && status <= 299;

export enum LocalStorageKey {
  AppUpdateTime = 'appUpdateTime',
  AmplifyRedirect = 'amplifySignInRedirect',
  Beta = 'beta',
  EnvironmentBanner = 'environmentBanner',
  ShowTagline = 'showTagline',
  RedirectPath = 'redirectPath',
}
