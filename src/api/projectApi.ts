import Axios from 'axios';
import { Dispatch } from 'redux';

import { setNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { NotificationVariant } from '../types/notification.types';

export enum ProjectsApiPaths {
  PROJECTS = '/cristin-projects',
}

export const searchProjectsByTitle = async (query: string, dispatch: Dispatch) => {
  const titleQuery = `title=${encodeURIComponent(query)}`;
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
      dispatch(setNotification(i18n.t('feedback:error.get_project'), NotificationVariant.Error));
    }
  } catch {
    dispatch(setNotification(i18n.t('feedback:error.get_project'), NotificationVariant.Error));
  }
};
