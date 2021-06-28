import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { Authority } from '../types/authority.types';
import { StatusCode } from '../utils/constants';
import { AuthorityApiPaths } from './apiPaths';
import { apiRequest } from './apiRequest';
import { getIdToken } from './userApi';

export enum AuthorityQualifiers {
  FEIDE_ID = 'feideid',
  ORCID = 'orcid',
  ORGUNIT_ID = 'orgunitid',
}

export const getAuthority = async (arpId: string, cancelToken?: CancelToken) =>
  await apiRequest<Authority>({
    url: arpId,
    cancelToken,
  });

export const createAuthority = async (firstName: string, lastName: string, feideId?: string, cristinId?: string) => {
  const url = AuthorityApiPaths.PERSON;

  const error = i18n.t('feedback:error.create_authority');

  try {
    // remove when Authorization headers are set for all requests
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.post(url, { invertedname: `${lastName}, ${firstName}` }, { headers });
    if (response.status === StatusCode.OK) {
      if (feideId) {
        const arpId = response.data.id;
        const updatedAuthority = await addQualifierIdForAuthority(arpId, AuthorityQualifiers.FEIDE_ID, feideId);
        if (updatedAuthority) {
          if (cristinId) {
            const updatedAuthorityWithCristinId = await addQualifierIdForAuthority(
              arpId,
              AuthorityQualifiers.ORGUNIT_ID,
              cristinId
            );
            if (updatedAuthorityWithCristinId) {
              return updatedAuthorityWithCristinId;
            }
          } else {
            return updatedAuthority;
          }
        }
      } else {
        return response.data;
      }
    } else {
      return { error };
    }
  } catch {
    return { error };
  }
};

export const addQualifierIdForAuthority = async (arpId: string, qualifier: AuthorityQualifiers, identifier: string) => {
  const url = `${arpId}/identifiers/${qualifier}/add`;

  const error = i18n.t('feedback:error.update_authority', { qualifier: i18n.t(`common:${qualifier}`) });

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };
    const response = await Axios.post(url, { identifier }, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error };
    }
  } catch {
    return { error };
  }
};

export const updateQualifierIdForAuthority = async (
  arpId: string,
  qualifier: AuthorityQualifiers,
  identifier: string,
  updatedIdentifier: string
) => {
  const url = `${arpId}/identifiers/${qualifier}/update`;

  const error = i18n.t('feedback:error.update_authority', { qualifier: i18n.t(`common:${qualifier}`) });

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.put(url, { identifier, updatedIdentifier }, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error };
    }
  } catch {
    return { error };
  }
};

export const removeQualifierIdFromAuthority = async (
  arpId: string,
  qualifier: AuthorityQualifiers,
  identifier: string
) => {
  const url = `${arpId}/identifiers/${qualifier}/delete`;

  const error = i18n.t('feedback:error.delete_identifier', { qualifier: i18n.t(`common:${qualifier}`) });

  try {
    const idToken = await getIdToken();
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    const response = await Axios.delete(url, { data: { identifier }, headers });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error };
    }
  } catch {
    return { error };
  }
};
