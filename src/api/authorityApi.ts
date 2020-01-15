import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { Authority } from '../types/authority.types';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';

export enum AuthorityApiPaths {
  AUTHORITY = '/authority',
}

interface AuthorityResponse {
  name: string;
  scn: string;
  feideIds: string[];
  orcIds: string[];
  birthDate?: string;
  handle: string;
}

export const getAuthorities = async (name: string, dispatch: Dispatch) => {
  const url = encodeURI(`/authority?name=${name}`);

  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
    const response = await Axios.get(url, { headers });

    if (response.status === StatusCode.OK) {
      return response.data.map((auth: AuthorityResponse) => ({
        name: auth.name,
        systemControlNumber: auth.scn,
        feideIds: auth.feideIds,
        orcids: auth.orcIds,
        birthDate: auth.birthDate,
        handle: auth.handle,
      }));
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
  }
};

export const getAuthorityByFeideId = async (feideId: string, dispatch: Dispatch) => {
  const url = encodeURI(`/authority?name=${feideId}`);

  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
    const response = await Axios.get(url, { headers });

    if (response.status === StatusCode.OK) {
      const filteredAuthorities: Authority[] = response.data
        .map((auth: AuthorityResponse) => ({
          name: auth.name,
          systemControlNumber: auth.scn,
          feideIds: auth.feideIds,
          orcids: auth.orcIds,
          birthDate: auth.birthDate,
          handle: auth.handle,
        }))
        .filter((auth: AuthorityResponse) => auth.feideIds.some(id => id === feideId));
      console.log('filteredAuthorities', filteredAuthorities);
      return filteredAuthorities?.[0] ?? null;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_authority'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_authority'), 'error'));
  }
};

// TODO: handle 204 from backend
export const updateFeideIdForAuthority = async (feideId: string, systemControlNumber: string, dispatch: Dispatch) => {
  if (!feideId) {
    return;
  }

  const url = `${AuthorityApiPaths.AUTHORITY}/${systemControlNumber}`;
  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
    const response = await Axios.put(url, { feideId }, { headers });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
  }
};

// TODO: handle 204 from backend
export const updateOrcIdForAuthority = async (orcId: string, systemControlNumber: string, dispatch: Dispatch) => {
  if (!orcId) {
    return;
  }

  const url = `${AuthorityApiPaths.AUTHORITY}/${systemControlNumber}`;
  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
    const response = await Axios.put(url, { orcId }, { headers });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.update_authority'), 'error'));
  }
};
