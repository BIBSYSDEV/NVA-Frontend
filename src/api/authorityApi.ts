import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';

export enum AuthorityApiPaths {
  AUTHORITY = '/authority',
}

export const getAuthorities = async (name: string, dispatch: Dispatch) => {
  const url = encodeURI(`${AuthorityApiPaths.AUTHORITY}?name=${name}`);

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
      dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_authorities'), 'error'));
  }
};

export const updateFeideForAuthority = async (feideid: string, systemControlNumber: string) => {
  if (!feideid) {
    return;
  }

  const url = `${AuthorityApiPaths.AUTHORITY}/${systemControlNumber}`;
  return await updateAuthorityAndHandleErrors(url, { feideid });
};

export const updateOrcidForAuthority = async (orcid: string, systemControlNumber: string) => {
  if (!orcid) {
    return;
  }

  const url = `${AuthorityApiPaths.AUTHORITY}/${systemControlNumber}`;
  return await updateAuthorityAndHandleErrors(url, { orcid });
};

export const updateInstitutionForAuthority = async (orgunitid: string, systemControlNumber: string) => {
  if (!orgunitid) {
    return;
  }

  const url = `${AuthorityApiPaths.AUTHORITY}/${systemControlNumber}`;
  return await updateAuthorityAndHandleErrors(url, { orgunitid });
};

export const addInstitutionForAuthority = async (
  cristinUnitId: string,
  orgunitids: string[],
  systemControlNumber: string
) => {
  if (!(orgunitids.length > 0)) {
    if (!orgunitids.find(orgunitid => orgunitid === cristinUnitId)) {
      const updatedAuthority = await updateInstitutionForAuthority(cristinUnitId, systemControlNumber);
      if (updatedAuthority?.error) {
        return { error: updatedAuthority.error };
      } else if (updatedAuthority) {
        return updatedAuthority;
      }
    }
  }
};

export const createAuthority = async (name: string) => {
  const url = AuthorityApiPaths.AUTHORITY;

  // remove when Authorization headers are set for all requests
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  try {
    const response = await Axios.post(url, { name }, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else if (response.status === StatusCode.NO_CONTENT) {
      return;
    } else {
      return {
        error: i18n.t('feedback:error.create_authority'),
      };
    }
  } catch (error) {
    return {
      error: i18n.t('feedback:error.create_authority'),
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
  } catch (error) {
    return {
      error: i18n.t('feedback:error.update_authority'),
    };
  }
};
