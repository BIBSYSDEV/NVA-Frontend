import { Authority } from '../types/authority.types';
import { isSuccessStatus } from '../utils/constants';
import { AuthorityApiPath } from './apiPaths';
import { authenticatedApiRequest } from './apiRequest';

export enum AuthorityQualifiers {
  FeideId = 'feideid',
  Orcid = 'orcid',
  OrgUnitId = 'orgunitid',
}

export const createAuthority = async (firstName: string, lastName: string, feideId?: string, cristinId?: string) => {
  const createAuthorityResponse = await authenticatedApiRequest<Authority>({
    url: AuthorityApiPath.Person,
    method: 'POST',
    data: { invertedname: `${lastName}, ${firstName}` },
  });
  if (isSuccessStatus(createAuthorityResponse.status)) {
    const arpId = createAuthorityResponse.data.id;
    if (feideId) {
      const updateAuthorityResponse = await addQualifierIdForAuthority(arpId, AuthorityQualifiers.FeideId, feideId);
      if (isSuccessStatus(createAuthorityResponse.status)) {
        createAuthorityResponse.data = updateAuthorityResponse.data;
      }
    }
    if (cristinId) {
      const updateAuthorityResponse = await addQualifierIdForAuthority(arpId, AuthorityQualifiers.OrgUnitId, cristinId);
      if (isSuccessStatus(createAuthorityResponse.status)) {
        createAuthorityResponse.data = updateAuthorityResponse.data;
      }
    }
  }

  return createAuthorityResponse;
};

export const addQualifierIdForAuthority = async (arpId: string, qualifier: AuthorityQualifiers, identifier: string) =>
  await authenticatedApiRequest<Authority>({
    url: `${arpId}/identifiers/${qualifier}/add`,
    method: 'POST',
    data: { identifier },
  });

export const updateQualifierIdForAuthority = async (
  arpId: string,
  qualifier: AuthorityQualifiers,
  identifier: string,
  updatedIdentifier: string
) =>
  await authenticatedApiRequest<Authority>({
    url: `${arpId}/identifiers/${qualifier}/update`,
    method: 'PUT',
    data: { identifier, updatedIdentifier },
  });

export const removeQualifierIdFromAuthority = async (
  arpId: string,
  qualifier: AuthorityQualifiers,
  identifier: string
) =>
  await authenticatedApiRequest<Authority>({
    url: `${arpId}/identifiers/${qualifier}/delete`,
    method: 'DELETE',
    data: { identifier },
  });
