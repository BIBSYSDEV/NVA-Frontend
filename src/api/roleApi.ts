import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { StatusCode, TEMP_ROLES_API } from '../utils/constants';
import { getIdToken } from './userApi';
import { RoleName, InstitutionUser, UserRole } from '../types/user.types';

export enum RoleApiPaths {
  INSTITUTIONS = '/institutions',
  USERS = '/users',
}

export const getInstitutionUser = async (username: string, cancelToken?: CancelToken) => {
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

export const getUsersForInstitution = async (institution: string, cancelToken?: CancelToken) => {
  // TODO: Remove tempBaseUrl when endpoint is moved to normal backend path
  const url = `${TEMP_ROLES_API}${RoleApiPaths.INSTITUTIONS}/${institution}/users`;

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.get(url, { headers, cancelToken });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_users_for_institution') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_users_for_institution') };
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
  const roleElement = { rolename, type: 'Role' };

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const data = {
      institution,
      username,
      roles: [roleElement],
      type: 'User',
    };

    const response = await Axios.post(url, data, { headers, cancelToken });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.add_role') };
    }
  } catch (error) {
    if (error.response.status === StatusCode.CONFLICT) {
      // Update existing user instead of creating a new one
      return await getUserAndAddRole(username, roleElement, cancelToken);
    } else if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.add_role') };
    }
  }
};

const getUserAndAddRole = async (username: string, newRole: UserRole, cancelToken?: CancelToken) => {
  try {
    const existingUser = await getInstitutionUser(username, cancelToken);
    if (existingUser && !existingUser.error) {
      const newInstitutionUser: InstitutionUser = {
        ...existingUser,
        roles: [...existingUser.roles, newRole],
      };
      return await updateUserRoles(newInstitutionUser);
    } else {
      return { error: i18n.t('feedback:error.add_role') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.add_role') };
    }
  }
};

export const updateUserRoles = async (institutionUser: InstitutionUser, cancelToken?: CancelToken) => {
  // TODO: Remove tempBaseUrl when endpoint is moved to normal backend path
  const url = `${TEMP_ROLES_API}${RoleApiPaths.USERS}/${institutionUser.username}`;

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.put(url, institutionUser, { headers, cancelToken });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else if (response.status === StatusCode.ACCEPTED) {
      return institutionUser;
    } else {
      return { error: i18n.t('feedback:error.update_institution_user') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.update_institution_user') };
    }
  }
};
