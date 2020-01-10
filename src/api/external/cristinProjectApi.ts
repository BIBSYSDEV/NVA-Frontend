import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { API_URL, ApiServiceUrl, StatusCode } from '../../utils/constants';

const PROJECT_SERVICE_BASE_URL = `${API_URL}${ApiServiceUrl.PROJECT}`;
export const PROJECT_SEARCH_URL = `${PROJECT_SERVICE_BASE_URL}/insert-resource`;

export const searchCristinProjects = async (query: string, dispatch: Dispatch) => {
  try {
    const response = await Axios.get(`${PROJECT_SEARCH_URL}?${query}`);
    if (response.status === StatusCode.OK && response.headers) {
      response.data.totalCount = response.headers['X-Total-Count'];
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_cristin_project'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_cristin_project'), 'error'));
  }
};
