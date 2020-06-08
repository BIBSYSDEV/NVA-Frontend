import Axios, { CancelToken } from 'axios';

import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';

export enum ProjectsApiPaths {
  PROJECT = '/project',
}

export const searchProjectsByTitle = async (query: string, cancelToken?: CancelToken) => {
  const titleQuery = `title=${encodeURIComponent(query)}`;
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(`${ProjectsApiPaths.PROJECT}?${titleQuery}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      cancelToken,
    });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_project') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_project') };
    }
  }
};
