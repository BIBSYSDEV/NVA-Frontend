import Axios from 'axios';
import { Dispatch } from 'redux';

import { setNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { User } from '../types/user.types';
import { NotificationVariant } from '../types/notification.types';

export enum AuthorityApiPaths {
  PERSON = '/person',
}

export enum AuthorityQualifiers {
  FEIDE_ID = 'feideid',
  ORCID = 'orcid',
  ORGUNIT_ID = 'orgunitid',
}

export const getAuthorities = async (name: string, dispatch: Dispatch) => {
  const url = encodeURI(`${AuthorityApiPaths.PERSON}?name=${name}`);

  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  try {
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

export const updateFeideForAuthority = async (feideid: string, systemControlNumber: string) => {
  if (!feideid) {
    return;
  }

  const url = `${AuthorityApiPaths.PERSON}/${systemControlNumber}`;
  return await updateAuthorityAndHandleErrors(url, { feideid });
};

export const updateOrcidForAuthority = async (orcid: string, systemControlNumber: string) => {
  if (!orcid) {
    return;
  }

  const url = `${AuthorityApiPaths.PERSON}/${systemControlNumber}`;
  return await updateAuthorityAndHandleErrors(url, { orcid });
};

export const updateInstitutionForAuthority = async (orgunitid: string, systemControlNumber: string) => {
  if (!orgunitid) {
    return;
  }

  const url = `${AuthorityApiPaths.PERSON}/${systemControlNumber}`;
  return await updateAuthorityAndHandleErrors(url, { orgunitid });
};

export const createAuthority = async (user: User) => {
  const url = AuthorityApiPaths.PERSON;

  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  try {
    const response = await Axios.post(url, { invertedname: `${user.familyName},${user.givenName}` }, { headers });
    if (response.status === StatusCode.OK) {
      // TODO: check with backend why we suddenly get a list with one element as response when creating new authority
      return response.data[0];
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

const updateAuthorityAndHandleErrors = async (url: string, body: any) => {
  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  try {
    const response = await Axios.put(url, body, { headers });
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
