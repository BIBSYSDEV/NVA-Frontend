import Axios from 'axios';
import { ApiBaseUrl, ExternalApi, StatusCode } from '../utils/constants';
import { addNotification } from '../redux/actions/notificationActions';
import { Dispatch } from 'redux';

export const searchCristinProjects = async (query: string, dispatch: Dispatch) => {
  try {
    const response = await Axios.get(`${ExternalApi.CRISTIN}/projects?${query}`);
    if (response.status === StatusCode.OK && response.headers) {
      response.data.totalCount = response.headers['X-Total-Count'];
      return response.data;
    } else {
      dispatch(
        addNotification({ key: 'error.get_cristin_project', message: 'error.get_cristin_project', variant: 'error' }) //TODO: vent på Kjetils PR
      );
    }
  } catch (err) {
    dispatch(
      addNotification({ key: 'error.get_cristin_project', message: 'error.get_cristin_project', variant: 'error' }) //TODO: vent på Kjetils PR
    );
  }
};
