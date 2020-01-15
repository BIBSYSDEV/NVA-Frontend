import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';

export enum ProjectsApiPaths {
  PROJECTS = '/cristin-projects',
}

export const searchProjectsByTitle = async (query: string, dispatch: Dispatch) => {
  const titleQuery = `title=${query}`;
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(`${ProjectsApiPaths.PROJECTS}?${titleQuery}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_project'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_project'), 'error'));
  }
};
