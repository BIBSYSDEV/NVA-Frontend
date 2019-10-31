import Axios from 'axios';
import { Dispatch } from 'redux';

import { orcidRequestFailureAction, setOrcidInfoAction } from '../actions/orcidActions';
import { ORCID_API_BASEURL } from '../utils/constants';

export const orcidLookup = async (dispatch: Dispatch, orcidCode: string) => {
  const data = {
    client_id: '1234312313',
    client_secret: '1231jh1231j',
    grant_type: 'authorization_code',
    code: orcidCode,
    redirect_uri: 'http://localhost:3000',
  };

  Axios({
    method: 'POST',
    url: ORCID_API_BASEURL,
    data: data,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      dispatch(setOrcidInfoAction(response.data.name, response.data.orcid));
    })
    .catch(() => {
      dispatch(orcidRequestFailureAction('ErrorMessage.ORCID request failed'));
    });
};
