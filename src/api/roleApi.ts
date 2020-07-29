import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { StatusCode, TEMP_ROLES_API } from '../utils/constants';
import { getIdToken } from './userApi';
import { RoleName } from '../types/user.types';

export enum RoleApiPaths {
  USERS = '/users',
}

export const getMyRoles = async (username: string, cancelToken?: CancelToken) => {
  // TODO: Remove tempBaseUrl when endpoint is moved to normal backend path
  const url = `${TEMP_ROLES_API}${RoleApiPaths.USERS}/${username}`;

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

export const assignUserRole = async (
  institution: string,
  username: string,
  rolename: RoleName,
  cancelToken?: CancelToken
) => {
  // TODO: Remove tempBaseUrl when endpoint is moved to normal backend path
  const url = `${TEMP_ROLES_API}${RoleApiPaths.USERS}`;

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const data = {
      institution,
      username,
      roles: [{ rolename }],
    };
    const response = await Axios.post(url, data, { headers, cancelToken });
    return response.data;
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.add_role') };
    }
  }
};
