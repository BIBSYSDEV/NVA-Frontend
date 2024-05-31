import { InstitutionUser, RoleName, UserList } from '../types/user.types';
import { getFullName } from '../utils/user-helpers';
import { RoleApiPath } from './apiPaths';
import { authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';

export interface CreateUserPayload extends Pick<InstitutionUser, 'roles' | 'viewingScope'> {
  cristinIdentifier: string;
  customerId: string;
}

export const updateUser = async (username: string, newUser: InstitutionUser) =>
  await authenticatedApiRequest2<InstitutionUser>({
    url: `${RoleApiPath.Users}/${encodeURIComponent(username)}`,
    method: 'PUT',
    data: newUser,
  });

export const createUser = async (newUserPayload: CreateUserPayload) => {
  const createUserResponse = await authenticatedApiRequest<InstitutionUser>({
    url: RoleApiPath.Users,
    method: 'POST',
    data: newUserPayload,
  });

  if (createUserResponse.status === 200) {
    // If the user already exists, the API will return 200 without persisting the sent data.
    // The current data must then be merged with the new data before updating current user.
    const existingRoles = createUserResponse.data.roles.map((role) => role.rolename);
    const rolesToAdd = newUserPayload.roles.map((role) => role.rolename);
    const rolesSet = new Set([...existingRoles, ...rolesToAdd]);

    const existingViewingScope = createUserResponse.data.viewingScope.includedUnits;
    const viewingScopeToAdd = newUserPayload.viewingScope.includedUnits;
    const viewingScopeSet = new Set([...existingViewingScope, ...viewingScopeToAdd]);

    const updateUserPayload: InstitutionUser = {
      ...createUserResponse.data,
      roles: Array.from(rolesSet).map((rolename) => ({ type: 'Role', rolename })),
      viewingScope: { type: 'ViewingScope', includedUnits: Array.from(viewingScopeSet) },
    };
    return await updateUser(updateUserPayload.username, updateUserPayload);
  } else {
    return createUserResponse;
  }
};

export const fetchUser = async (username: string) => {
  const userResponse = await authenticatedApiRequest2<InstitutionUser>({ url: `${RoleApiPath.Users}/${username}` });
  return userResponse.data;
};

export const fetchUsersByCustomer = async (customerId: string, role?: RoleName | RoleName[]) => {
  const searchParams = new URLSearchParams();

  if (customerId) {
    searchParams.set('institution', customerId);
  }

  if (role) {
    if (typeof role === 'string') {
      searchParams.set('role', role);
    } else if (Array.isArray(role) && role.length > 0) {
      role.forEach((role) => searchParams.append('role', role));
    }
  }

  const usersResponse = await authenticatedApiRequest2<UserList>({
    url: `${RoleApiPath.InstitutionUsers}?${searchParams.toString()}`,
  });

  return usersResponse.data.users.sort((a, b) => {
    const nameA = getFullName(a.givenName, a.familyName);
    const nameB = getFullName(b.givenName, b.familyName);
    return nameA.localeCompare(nameB);
  });
};
