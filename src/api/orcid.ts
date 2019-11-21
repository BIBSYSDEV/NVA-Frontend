import Axios from 'axios';
import { Dispatch } from 'redux';

import { orcidRequestFailure, setOrcidInfo } from '../redux/actions/orcidActions';
import i18n from '../translations/i18n';
import { ORCID_OAUTH_URL, StatusCode } from '../utils/constants';

export const getOrcidInfo = (orcidCode: string) => {
  return async (dispatch: Dispatch) => {
    const data = {
      client_id: process.env.REACT_APP_ORCID_CLIENT_ID,
      client_secret: process.env.REACT_APP_ORCID_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: orcidCode,
      redirect_uri: process.env.REACT_APP_ORCID_REDIRECT_URI,
    };
    try {
      const response = await Axios({
        method: 'POST',
        url: ORCID_OAUTH_URL,
        data: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === StatusCode.OK) {
        dispatch(setOrcidInfo(response.data.name, response.data.orcid));
      } else {
        dispatch(orcidRequestFailure(i18n.t('feedback:error.get_orcid')));
      }
    } catch {
      dispatch(orcidRequestFailure(i18n.t('feedback:error.get_orcid')));
    }
  };
};
