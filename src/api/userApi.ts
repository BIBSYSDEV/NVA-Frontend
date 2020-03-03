import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { Dispatch } from 'redux';

import { loginSuccess, logoutSuccess, refreshTokenFailure } from '../redux/actions/authActions';
import { clearUser, setUser, setUserFailure } from '../redux/actions/userActions';
import { RootStore } from '../redux/reducers/rootReducer';
import i18n from '../translations/i18n';
import { USE_MOCK_DATA } from '../utils/constants';
import { mockUser } from '../utils/testfiles/mock_feide_user';
import mockInstitutionUsersResponse from '../utils/testfiles/institution_users_query.json';
import { RoleName } from '../types/user.types';

export enum UsersApiPaths {
  USERS = '/users',
}

export const login = () => {
  return async (dispatch: Dispatch) => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
      dispatch(loginSuccess());
    } else {
      Auth.federatedSignIn();
    }
  };
};

export const getCurrentAuthenticatedUser = () => {
  return async (dispatch: Dispatch<any>, getState: () => RootStore) => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      cognitoUser?.getSession(async (error: any, session: CognitoUserSession) => {
        if (error || !session.isValid()) {
          const currentSession = await Auth.currentSession();
          cognitoUser.refreshSession(currentSession.getRefreshToken());
        } else {
          // NOTE: getSession must be called to authenticate user before calling getUserAttributes
          cognitoUser.getUserAttributes((error: any) => {
            if (error) {
              dispatch(setUserFailure(i18n.t('feedback:error.get_user')));
            } else {
              dispatch(setUser(cognitoUser.attributes));
            }
          });
        }
      });
    } catch {
      const store = getState();
      if (store.user.isLoggedIn) {
        dispatch(setUserFailure(i18n.t('feedback:error.get_user')));
      }
    }
  };
};

export const getIdToken = async () => {
  if (USE_MOCK_DATA) {
    return '';
  }
  const cognitoUser = await Auth.currentAuthenticatedUser();
  return cognitoUser?.signInUserSession?.idToken?.jwtToken || null;
};

export const refreshToken = () => {
  return async (dispatch: Dispatch) => {
    try {
      const currentSession = await Auth.currentSession();
      const cognitoUser = await Auth.currentAuthenticatedUser();
      if (!currentSession.isValid()) {
        cognitoUser.refreshSession(currentSession.getRefreshToken(), (error: any) => {
          if (error) {
            dispatch(refreshTokenFailure(error));
          }
        });
      }
    } catch (e) {
      dispatch(refreshTokenFailure(e));
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    if (USE_MOCK_DATA) {
      dispatch(clearUser());
      dispatch(logoutSuccess());
    } else {
      Auth.signOut();
    }
  };
};

export const listInstitutionUsers = (cristinUnitId: string) => {
  // TODO: get institution users from endpoint
  // BACKEND NOT FINISHED YET
  // const idToken = await getIdToken();
  // const headers = {
  //   Authorization: `Bearer ${idToken}`,
  // };
  // const url = `${UsersApiPaths.USERS}/${cristinUnitId}`;

  // try {
  //   const response = await Axios.get(url, { headers });
  //   return response.data;
  // } catch {
  //   return null;
  // }

  return mockInstitutionUsersResponse.map(user => ({
    ...user,
    roles: user.roles.map(roleName => RoleName[roleName as keyof typeof RoleName]),
  }));
};
