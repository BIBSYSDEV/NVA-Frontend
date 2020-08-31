import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { RoleName, InstitutionUser, UserRole } from '../types/user.types';

export enum RoleApiPaths {
  INSTITUTIONS = '/users-roles/institutions',
  USERS = '/users-roles/users',
}

export const getInstitutionUser = async (username: string, cancelToken?: CancelToken) => {
  const url = `${RoleApiPaths.USERS}/${encodeURIComponent(username)}`;

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
  const url = `${RoleApiPaths.INSTITUTIONS}/${institution}/users`;

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

export const addRoleToUser = async (username: string, rolename: RoleName, cancelToken?: CancelToken) => {
  try {
    const existingUser = await getInstitutionUser(username, cancelToken);
    if (existingUser) {
      if (existingUser.error) {
        // Forward error message returned from fetching existing user request
        return existingUser;
      } else if (existingUser.roles.some((role: UserRole) => role.rolename === rolename)) {
        // Skip update if user already has role we want to add
        return existingUser;
      } else {
        // Update user
        const roleElement = { rolename, type: 'Role' };
        const newInstitutionUser: InstitutionUser = {
          ...existingUser,
          roles: [...existingUser.roles, roleElement],
        };
        return await updateUserRoles(newInstitutionUser, cancelToken);
      }
    } else {
      return { error: i18n.t('feedback:error.add_role') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.add_role') };
    }
  }
};

export const removeRoleFromUser = async (username: string, rolename: RoleName, cancelToken?: CancelToken) => {
  try {
    const existingUser = await getInstitutionUser(username, cancelToken);
    if (existingUser) {
      if (existingUser.error) {
        // Forward error message returned from fetching existing user request
        return existingUser;
      } else {
        // Update user
        const newInstitutionUser: InstitutionUser = {
          ...existingUser,
          roles: existingUser.roles.filter((role: UserRole) => role.rolename !== rolename),
        };
        return await updateUserRoles(newInstitutionUser, cancelToken);
      }
    } else {
      return { error: i18n.t('feedback:error.remove_role') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.remove_role') };
    }
  }
};

const updateUserRoles = async (institutionUser: InstitutionUser, cancelToken?: CancelToken) => {
  const url = `${RoleApiPaths.USERS}/${encodeURIComponent(institutionUser.username)}`;
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
