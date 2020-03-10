import mockInstitutionUsersResponse from '../utils/testfiles/institution_users_query.json';
import { RoleName } from '../types/user.types';

export enum UsersApiPaths {
  USERS = '/users',
}

export const getInstitutionUsers = (cristinUnitId: string) => {
  // TODO: get institution users from endpoint
  // BACKEND NOT FINISHED YET
  // const idToken = await getIdToken();
  // const headers = {
  //   Authorization: `Bearer ${idToken}`,
  // };
  // const url = `${UsersApiPaths.USERS}/${cristinUnitId}`;

  // try {
  //   const response = await Axios.get(url, { headers });
  //   return response.data;
  // } catch {
  //   return null;
  // }

  return mockInstitutionUsersResponse.map(user => ({
    ...user,
    roles: user.roles as RoleName[],
  }));
};

export const addUserToInstitution = (cristinUnitId: string, authenticationId: string, role: RoleName) => {
  // TODO: add new user to institution
  // BACKEND DOES NOT EXIST YET
  // const idToken = await getIdToken();
  // const headers = {
  //   Authorization: `Bearer ${idToken}`,
  // };
  // const url = `${UsersApiPaths.USERS}/${cristinUnitId}/`;
  // try {
  //   const response = await Axios.get(url, { headers });
  //   return response.data;
  // } catch {
  //   return null;
  // }
};
