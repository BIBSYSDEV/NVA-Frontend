import Axios from 'axios';
import { Dispatch } from 'redux';
import i18n from '../../translations/i18n';

import { addNotification } from '../../redux/actions/notificationActions';
import { StatusCode, ALMA_API_URL } from '../../utils/constants';
import uuid from 'uuid';

// ALMA API docs: https://developers.exlibrisgroup.com/alma/apis/

export const getPublications = async (systemControlNumber: string, dispatch: Dispatch) => {
  const url = `${ALMA_API_URL}/almaws/v1/bibs`;
  console.log('url:', url, 'scn:', systemControlNumber);

  try {
    const response = await Axios.get(url, { headers: { Authorization: `apikey <MY_KEY>` } });

    if (response.status === StatusCode.OK) {
      console.log(response.data);
      return [];
    } else {
      dispatch(
        addNotification({ message: i18n.t('feedback:error.get_publications'), variant: 'error', key: uuid.v4() })
      );
    }
  } catch (error) {
    dispatch(addNotification({ message: i18n.t('feedback:error.get_publications'), variant: 'error', key: uuid.v4() }));
  }
  return [];
};
