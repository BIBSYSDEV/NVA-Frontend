import Axios from 'axios';
import { Dispatch } from 'redux';
import i18n from '../../translations/i18n';
import { AlmaPublication } from '../../types/publication.types';
import { addNotification } from '../../redux/actions/notificationActions';
import { StatusCode } from '../../utils/constants';
import uuid from 'uuid';

// ALMA API docs: https://developers.exlibrisgroup.com/alma/apis/

enum AlmaCodes {
  PUBLICATION_DATA_TAG = 'srw_dc:dc',
  TITLE_TAG = 'dc:title',
  DATE_TAG = 'dc:date',
}

const almaAuthorityDataUrl = (systemControlNumber: string) =>
  `/view/sru/47BIBSYS_NETWORK?version=1.2&operation=searchRetrieve&recordSchema=dc&maximumRecords=10&startRecord=1&query=authority_id=${systemControlNumber}`;

export const getPublications = async (systemControlNumber: string, dispatch: Dispatch) => {
  const url = almaAuthorityDataUrl(systemControlNumber);
  try {
    const response = await Axios.get(url);

    if (response.status === StatusCode.OK) {
      const domParser = new DOMParser();
      const xmlData = domParser.parseFromString(response.data, 'application/xml');
      const xmlPublications = Array.from(xmlData.getElementsByTagName(AlmaCodes.PUBLICATION_DATA_TAG));

      // Extract title and date from publications
      const publications: AlmaPublication[] = xmlPublications.map(publication => {
        const titleTags = publication.getElementsByTagName(AlmaCodes.TITLE_TAG);
        const dateTags = publication.getElementsByTagName(AlmaCodes.DATE_TAG);

        return {
          title: titleTags.length ? titleTags[0].innerHTML : '',
          date: dateTags.length ? dateTags[0].innerHTML : '',
        };
      });
      // Filter out publications where titles are missing, and do a (naive) sort by date
      return publications.filter(publication => publication.title).sort((a, b) => b.date.localeCompare(a.date));
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
