import Axios, { CancelToken } from 'axios';
import { Dispatch } from 'redux';

import { setNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { NotificationVariant } from '../types/notification.types';

export enum AuthorityApiPaths {
  PERSON = '/person',
}

export enum AuthorityQualifiers {
  FEIDE_ID = 'feideid',
  ORCID = 'orcid',
  ORGUNIT_ID = 'orgunitid',
}

export const getAuthority = async (arpId: string, cancelToken?: CancelToken) => {
  const url = encodeURI(`${AuthorityApiPaths.PERSON}?arpId=${arpId}`);

  try {
    // remove when Authorization headers are set for all requests
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.get(url, { headers, cancelToken });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_authority') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_authority') };
    }
  }
};

export const getAuthorities = async (name: string, dispatch: Dispatch) => {
  const url = encodeURI(`${AuthorityApiPaths.PERSON}?name=${name}`);

  try {
    // remove when Authorization headers are set for all requests
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.get(url, { headers });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      dispatch(setNotification(i18n.t('feedback:error.get_authorities'), NotificationVariant.Error));
    }
  } catch {
    dispatch(setNotification(i18n.t('feedback:error.get_authorities'), NotificationVariant.Error));
  }
};

export const createAuthority = async (firstName: string, lastName: string, feideId?: string) => {
  const url = AuthorityApiPaths.PERSON;

  try {
    // remove when Authorization headers are set for all requests
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.post(url, { invertedname: `${lastName}, ${firstName}` }, { headers });
    if (response.status === StatusCode.OK) {
      if (feideId) {
        const systemControlNumber = response.data.systemControlNumber;
        const updatedAuthority = await addQualifierIdForAuthority(
          systemControlNumber,
          AuthorityQualifiers.FEIDE_ID,
          feideId
        );
        if (updatedAuthority) {
          return updatedAuthority;
        }
      } else {
        return response.data;
      }
    } else if (response.status === StatusCode.NO_CONTENT) {
      return;
    } else {
      return {
        error: i18n.t('feedback:error.create_authority'),
      };
    }
  } catch {
    return {
      error: i18n.t('feedback:error.create_authority'),
    };
  }
};

export const addQualifierIdForAuthority = async (
  systemControlNumber: string,
  qualifier: AuthorityQualifiers,
  identifier: string
) => {
  const url = `${AuthorityApiPaths.PERSON}/${systemControlNumber}/identifiers/${qualifier}/${identifier}`;

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.post(url, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else if (response.status === StatusCode.NO_CONTENT) {
      return;
    } else {
      return {
        error: i18n.t('feedback:error.update_authority'),
      };
    }
  } catch {
    return {
      error: i18n.t('feedback:error.update_authority'),
    };
  }
};

export const updateQualifierIdForAuthority = async (
  systemControlNumber: string,
  qualifier: AuthorityQualifiers,
  identifier: string,
  updatedIdentifier: string
) => {
  const url = `${AuthorityApiPaths.PERSON}/${systemControlNumber}/identifiers/${qualifier}/${identifier}/update/${updatedIdentifier}`;

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.put(url, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return {
      error: i18n.t('feedback:error.update_identifier'),
    };
  }
};

export const removeQualifierIdFromAuthority = async (
  systemControlNumber: string,
  qualifier: AuthorityQualifiers,
  identifier: string
) => {
  const url = `${AuthorityApiPaths.PERSON}/${systemControlNumber}/identifiers/${qualifier}/${identifier}`;

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.delete(url, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return {
      error: i18n.t('feedback:error.delete_identifier'),
    };
  }
};
