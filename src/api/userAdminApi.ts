import mockInstitutionUsersResponse from '../utils/testfiles/institution_users_query.json';
import { RoleName } from '../types/user.types';

export const listInstitutionUsers = (cristinUnitId: string) => {
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
    roles: user.roles.map(roleName => RoleName[roleName as keyof typeof RoleName]),
  }));
};
