import Axios from 'axios';
import { Dispatch } from 'redux';

import { orcidRequestFailure, setOrcid } from '../../redux/actions/orcidActions';
import i18n from '../../translations/i18n';
import { ORCID_OAUTH_USER_INFO_URL, StatusCode } from '../../utils/constants';

export const getOrcidInfo = (orcidAccessToken: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await Axios({
        method: 'POST',
        url: ORCID_OAUTH_USER_INFO_URL,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${orcidAccessToken}`,
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(setOrcid(response.data.sub));
      } else {
        dispatch(orcidRequestFailure(i18n.t('feedback:error.get_orcid')));
      }
    } catch {
      dispatch(orcidRequestFailure(i18n.t('feedback:error.get_orcid')));
    }
  };
};
