import Axios from 'axios';
import { Dispatch } from 'redux';
import i18n from '../../translations/i18n';

import { addNotification } from '../../redux/actions/notificationActions';
import { StatusCode } from '../../utils/constants';
import uuid from 'uuid';

// ALMA API docs: https://developers.exlibrisgroup.com/alma/apis/

export const getPublications = async (systemControlNumber: string, dispatch: Dispatch) => {
  const url = `/view/sru/47BIBSYS_NETWORK?version=1.2&operation=searchRetrieve&recordSchema=dc&maximumRecords=10&startRecord=1&query=authority_id=${systemControlNumber}`;

  try {
    const response = await Axios.get(url);

    if (response.status === StatusCode.OK) {
      const domParser = new DOMParser();
      const xmlData = domParser.parseFromString(response.data, 'application/xml');
      const publicationTitles = Array.from(xmlData.getElementsByTagName('dc:title')).map(title => title.innerHTML);
      return publicationTitles;
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
