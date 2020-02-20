import Axios from 'axios';
import { getIdToken } from './userApi';
import { StatusCode } from '../utils/constants';

export enum MemberInstituionApiPaths {
  MEMBER_INSTITUTION = '/member-institutions',
}

export const getAllMemberInstitutions = async () => {
  const idToken = await getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };
  const url = `${MemberInstituionApiPaths.MEMBER_INSTITUTION}`;
  try {
    const response = await Axios.get(url, { headers });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return { error };
  }
};
