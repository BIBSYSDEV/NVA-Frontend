import Axios from 'axios';
import { Dispatch } from 'redux';

import { orcidRequestFailure, setOrcidInfo } from '../redux/actions/orcidActions';
import { ORCID_URL } from '../utils/constants';

export const getOrcidInfo = (orcidCode: string) => {
  return async (dispatch: Dispatch) => {
    const data = {
      client_id: '1234312313',
      client_secret: '1231jh1231j',
      grant_type: 'authorization_code',
      code: orcidCode,
      redirect_uri: 'http://localhost:3000',
    };

    Axios({
      method: 'POST',
      url: ORCID_URL,
      data: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        dispatch(setOrcidInfo(response.data.name, response.data.orcid));
      })
      .catch(() => {
        dispatch(orcidRequestFailure('ErrorMessage.ORCID request failed'));
      });
  };
};
