import Axios from 'axios';
import { CRISTIN_API_URL, StatusCode } from '../../utils/constants';
import { addNotification } from '../../redux/actions/notificationActions';
import { Dispatch } from 'redux';
import i18n from '../../translations/i18n';
import uuid from 'uuid';
import { Notification } from '../../types/notification.types';

const errorNotification: Notification = {
  key: uuid.v4(),
  message: i18n.t('feedback:error.get_cristin_project'),
  variant: 'error',
};

export const searchCristinProjects = async (query: string, dispatch: Dispatch) => {
  try {
    const response = await Axios.get(`${CRISTIN_API_URL}/projects?${query}`);
    if (response.status === StatusCode.OK && response.headers) {
      response.data.totalCount = response.headers['X-Total-Count'];
      return response.data;
    } else {
      dispatch(addNotification(errorNotification));
    }
  } catch (err) {
    dispatch(addNotification(errorNotification));
  }
};
