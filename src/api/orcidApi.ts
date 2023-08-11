import { OrcidCredentials } from '../types/orcid.types';
import { OrcidApiPath } from './apiPaths';
import { authenticatedApiRequest } from './apiRequest';

export const postOrcidCredentials = async (orcidCredentials: OrcidCredentials) =>
  await authenticatedApiRequest({
    url: OrcidApiPath.Orcid,
    method: 'POST',
    data: orcidCredentials,
  });
