import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { CRISTIN_API_URL, StatusCode } from '../../utils/constants';

export const searchCristinProjects = async (query: string, dispatch: Dispatch) => {
  try {
    const response = await Axios.get(`${CRISTIN_API_URL}/projects?${query}`);
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
