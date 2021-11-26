import { NotificationVariant } from '../types/notification.types';

const hostToUrlString = (hostString: string): string => {
  const url = hostString.startsWith('http')
    ? new URL(hostString.replace('http://', 'https://'))
    : new URL(`https://${hostString}`);
  return url.toString();
};

export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];
export const DEBOUNCE_INTERVAL_INPUT = 1000;

export const ORCID_BASE_URL = process.env.REACT_APP_ORCID_BASE_URL;
export const ORCID_USER_INFO_URL = `${ORCID_BASE_URL}/oauth/userinfo`;
export const ORCID_SIGN_IN_URL = `${ORCID_BASE_URL}/signin?oauth&client_id=${process.env.REACT_APP_ORCID_CLIENT_ID}&response_type=token&scope=openid&redirect_uri=${process.env.REACT_APP_ORCID_REDIRECT_URI}`;
export const FEIDE_IDENTITY_PROVIDER = 'FeideIdentityProvider';

export const AMPLIFY_REDIRECTED_KEY = 'amplify-redirected-from-hosted-ui';
export const REDIRECT_PATH_KEY = 'redirect-path';

export const API_URL = hostToUrlString(process.env.REACT_APP_API_HOST);

export const hrcsActivityBaseId = 'https://nva.unit.no/hrcs/activity';
export const hrcsCategoryBaseId = 'https://nva.unit.no/hrcs/category';

export const isErrorStatus = (status: number) => status >= 400 && status <= 599;
export const isSuccessStatus = (status: number) => status >= 200 && status <= 299;

export const autoHideNotificationDuration = {
  [NotificationVariant.Error]: 9000,
  [NotificationVariant.Info]: 3000,
  [NotificationVariant.Success]: 3000,
  [NotificationVariant.Warning]: 6000,
};
