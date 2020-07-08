import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { RoleName } from '../types/user.types';

export enum RoleApiPaths {
  USERS = '/users',
}

export interface Role {
  rolename: RoleName;
}

export interface UserRoles {
  institution: string;
  roles: Role[];
  username: string;
}

export const getMyRoles = async (username: string, cancelToken?: CancelToken) => {
  // TODO: Remove tempBaseUrl when endpoint is moved to normal backend path
  const tempBaseUrl = 'https://o6gjx84mca.execute-api.eu-west-1.amazonaws.com/Prod';
  const url = `${tempBaseUrl}${RoleApiPaths.USERS}/${username}`;

  try {
    const idToken = await getIdToken();
    const response = await Axios.get(url, {
      headers: { Authorization: `Bearer ${idToken}` },
      cancelToken,
    });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_roles') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_roles') };
    }
  }
};
