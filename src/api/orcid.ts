import { Dispatch } from 'redux';
import Axios from 'axios';

import { ORCID_API_BASEURL } from '../utils/constants';
import { orcidRequestFailureAction, setOrcidInfoAction } from '../actions/orcidActions';

export const mockOrcidLookup = async (dispatch: Dispatch, orcidCode: string) => {
  const data = {
    client_id: '1234312313',
    client_secret: '1231jh1231j',
    grant_type: 'authorization_code',
    code: orcidCode,
    redirect_uri: 'http://localhost:3000',
  };

  Axios({
    method: 'post',
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
      dispatch(orcidRequestFailureAction('ORCID request failed'));
    });
};
