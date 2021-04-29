import Axios from 'axios';
import { ORCID_USER_INFO_URL } from '../../utils/constants';

interface OrcidInfo {
  id: string;
}

export const getOrcidInfo = async (orcidAccessToken: string) =>
  await Axios.post<OrcidInfo>(ORCID_USER_INFO_URL, null, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${orcidAccessToken}`,
    },
  });
