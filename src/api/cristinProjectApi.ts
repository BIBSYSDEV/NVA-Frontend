import Axios from 'axios';
import { ApiBaseUrl, StatusCode } from '../utils/constants';
import { addNotification, removeNotification } from '../redux/actions/notificationActions';
import { Dispatch } from 'redux';

export const searchCristinProjects = async (query: string, dispatch: Dispatch) => {
  try {
    const response = await Axios.get(`${ApiBaseUrl.CRISTIN_EXTERNAL}/projects?${query}`);
    if (response.status === StatusCode.OK && response.headers) {
      response.data.totalCount = response.headers['X-Total-Count'];
      return response.data;
    } else {
      dispatch(
        addNotification({ key: 'error.get_cristin_project', message: 'error.get_cristin_project', variant: 'error' })
      );
    }
  } catch (err) {
    dispatch(
      addNotification({ key: 'error.get_cristin_project', message: 'error.get_cristin_project', variant: 'error' })
    );
  }
};
