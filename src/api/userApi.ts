import { Auth, CognitoUser } from '@aws-amplify/auth';
import { CreateCristinPerson, CristinPerson, Employment } from '../types/user.types';
import { USE_MOCK_DATA, LocalStorageKey } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';
import { CristinApiPath } from './apiPaths';
import { authenticatedApiRequest } from './apiRequest';

export const getCurrentUserAttributes = async (retryNumber = 0): Promise<any> => {
  try {
    const currentSession = await Auth.currentSession();

    if (!currentSession.isValid()) {
      const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
      // Refresh session
      await new Promise((resolve) => {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error, session) => {
          resolve(session);
        });
      });
    }
    const userInfo = await Auth.currentUserInfo();
    return userInfo.attributes;
  } catch {
    // Don't do anything if user is not supposed to be logged in
    if (localStorage.getItem(LocalStorageKey.AmplifyRedirect)) {
      if (retryNumber < 3) {
        return await getCurrentUserAttributes(retryNumber + 1);
      } else {
        window.location.search = ''; // Avoid infinite error loop if code parameter gets stuck in URL
        return null;
      }
    }
  }
};

export const getAccessToken = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    return cognitoUser?.signInUserSession?.accessToken?.jwtToken ?? null;
  } catch (error) {
    if (error === 'The user is not authenticated') {
      // Expired session token. Set state in localStorage that App.tsx can act upon
      localStorage.setItem(LocalStorageKey.ExpiredToken, 'true');
      window.location.href = UrlPathTemplate.Home;
    }
    return null;
  }
};

export const createCristinPerson = async (cristinPerson: CreateCristinPerson) =>
  await authenticatedApiRequest<CristinPerson>({
    url: CristinApiPath.Person,
    method: 'POST',
    data: cristinPerson,
  });

type EmploymentData = Omit<Employment, 'endDate' | 'fullTimeEquivalentPercentage'> &
  Partial<Pick<Employment, 'endDate' | 'fullTimeEquivalentPercentage'>>;

export const addEmployment = async (userId: string, employment: EmploymentData) =>
  await authenticatedApiRequest<Employment>({
    url: `${userId}/employment`,
    method: 'POST',
    data: employment,
  });

interface NationalNumberSearchData {
  type: 'NationalIdentificationNumber';
  value: string;
}

export const searchByNationalIdNumber = async (nationalIdNumber: string) => {
  const data: NationalNumberSearchData = {
    type: 'NationalIdentificationNumber',
    value: nationalIdNumber,
  };
  return await authenticatedApiRequest<CristinPerson>({
    url: CristinApiPath.PersonIdentityNumer,
    method: 'POST',
    data: data,
  });
};
