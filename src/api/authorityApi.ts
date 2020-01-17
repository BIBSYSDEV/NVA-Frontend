import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import { setAuthorityData, setPossibleAuthories } from '../redux/actions/userActions';
import i18n from '../translations/i18n';
import { Authority } from '../types/authority.types';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';

export enum AuthorityApiPaths {
  AUTHORITY = '/authority',
}

export const getAuthorities = async (name: string, feideId: string, dispatch: Dispatch) => {
  const url = encodeURI(`/authority?name=${name}`);

  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
    const response = await Axios.get(url, { headers });

    if (response.status === StatusCode.OK) {
      const filteredAuthorities: Authority[] = response.data.filter((auth: Authority) =>
        auth.feideids.some(id => id === feideId)
      );
      if (filteredAuthorities.length === 1) {
        dispatch(setAuthorityData(filteredAuthorities[0]));
      } else {
        dispatch(setPossibleAuthories(response.data));
        return response.data;
      }
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
  }
};

export const updateFeideForAuthority = async (feideid: string, systemControlNumber: string, dispatch: Dispatch) => {
  if (!feideid) {
    return;
  }

  const url = `${AuthorityApiPaths.AUTHORITY}/${systemControlNumber}`;
  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
    const response = await Axios.put(url, { feideid }, { headers });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else if (response.status === StatusCode.NO_CONTENT) {
      return;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
  }
};

export const updateOrcidForAuthority = async (orcid: string, systemControlNumber: string, dispatch: Dispatch) => {
  if (!orcid) {
    return;
  }

  const url = `${AuthorityApiPaths.AUTHORITY}/${systemControlNumber}`;
  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
    const response = await Axios.put(url, { orcid }, { headers });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else if (response.status === StatusCode.NO_CONTENT) {
      return;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
  }
};
