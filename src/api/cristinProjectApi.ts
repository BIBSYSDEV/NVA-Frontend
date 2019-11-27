import Axios from 'axios';
import { ExternalApi, StatusCode } from '../utils/constants';
import { addNotification } from '../redux/actions/notificationActions';
import { Dispatch } from 'redux';
import i18n from '../translations/i18n';

export const searchCristinProjects = async (query: string, dispatch: Dispatch) => {
  try {
    const response = await Axios.get(`${ExternalApi.CRISTIN}/projects?${query}`);
    if (response.status === StatusCode.OK && response.headers) {
      response.data.totalCount = response.headers['X-Total-Count'];
      return response.data;
    } else {
      dispatch(
        addNotification({
          key: 'error.get_cristin_project',
          message: i18n.t('feedback:error.get_cristin_project'),
          variant: 'error',
        }) //TODO: vent på Kjetils PR
      );
    }
  } catch (err) {
    dispatch(
      addNotification({
        key: 'error.get_cristin_project',
        message: i18n.t('feedback:error.get_cristin_project'),
        variant: 'error',
      }) //TODO: vent på Kjetils PR
    );
  }
};
