import Axios from 'axios';
import { Dispatch } from 'redux';

import { setExternalOrcid } from '../../redux/actions/orcidActions';
import i18n from '../../translations/i18n';
import { ORCID_USER_INFO_URL, StatusCode } from '../../utils/constants';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';

export const getOrcidInfo = (orcidAccessToken: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'POST',
        url: ORCID_USER_INFO_URL,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${orcidAccessToken}`,
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(setExternalOrcid(response.data.sub));
      } else {
        dispatch(setNotification(i18n.t('feedback:error.get_orcid', NotificationVariant.Error)));
      }
    } catch {
      dispatch(setNotification(i18n.t('feedback:error.get_orcid', NotificationVariant.Error)));
    }
  };
};
