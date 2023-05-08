import { authenticatedApiRequest2 } from './apiRequest';
import { OrcidApiPath } from './apiPaths';
import { OrcidCredentials } from '../types/orcid.types';

export const postOrcidCredentials = async (orcidCredentials: OrcidCredentials) =>
  await authenticatedApiRequest({
    url: OrcidApiPath.Orcid,
    method: 'POST',
    data: orcidCredentials,
  });
