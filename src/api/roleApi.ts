import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { InstitutionUser } from '../types/user.types';
import { RoleApiPath } from './apiPaths';
import { authenticatedApiRequest } from './apiRequest';

export const getInstitutionUser = async (username: string, cancelToken?: CancelToken) => {
  const url = `${RoleApiPath.Users}/${encodeURIComponent(username)}`;

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

  // return await authenticatedApiRequest<InstitutionUser>({ url: `${RoleApiPath.Users}/${username}` }); // error: t('feedback:error.get_roles')
};

export const updateUser = async (username: string, newUser: InstitutionUser) =>
  await authenticatedApiRequest<InstitutionUser>({
    url: `${RoleApiPath.Users}/${encodeURIComponent(username)}`,
    method: 'PUT',
    data: newUser,
  });
