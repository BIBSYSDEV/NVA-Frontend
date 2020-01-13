import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { API_TOKEN, API_URL, ApiServiceUrl, StatusCode } from '../utils/constants';

export const PROJECT_SERVICE_BASE_URL = `${API_URL}${ApiServiceUrl.PROJECT}`;

export const searchProjects = async (query: string, dispatch: Dispatch) => {
  try {
    const response = await Axios.get(`${PROJECT_SERVICE_BASE_URL}?${query}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    if (response.status === StatusCode.OK && response.headers) {
      response.data.totalCount = response.headers['X-Total-Count'];
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_project'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_project'), 'error'));
  }
};
