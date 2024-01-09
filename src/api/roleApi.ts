import { InstitutionUser, RoleName, UserList, UserRole } from '../types/user.types';
import { getFullName } from '../utils/user-helpers';
import { RoleApiPath } from './apiPaths';
import { authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';

interface CreateUserPayload {
  nationalIdentityNumber: string;
  roles: UserRole[];
  customerId: string;
}

export const updateUser = async (username: string, newUser: InstitutionUser) =>
  await authenticatedApiRequest<InstitutionUser>({
    url: `${RoleApiPath.Users}/${encodeURIComponent(username)}`,
    method: 'PUT',
    data: newUser,
  });

export const createUser = async (newUserPayload: CreateUserPayload) =>
  await authenticatedApiRequest<InstitutionUser>({ url: RoleApiPath.Users, method: 'POST', data: newUserPayload });

export const fetchUser = async (username: string) => {
  const userResponse = await authenticatedApiRequest2<InstitutionUser>({ url: `${RoleApiPath.Users}/${username}` });
  return userResponse.data;
};

export const fetchUsers = async (customerId: string, role: RoleName | RoleName[]) => {
  const searchParams = new URLSearchParams();

  if (customerId) {
    searchParams.set('institution', encodeURIComponent(customerId));
  }

  if (role) {
    if (typeof role === 'string') {
      searchParams.set('role', role);
    } else if (Array.isArray(role) && role.length > 0) {
      searchParams.set('role', encodeURIComponent(role.join(',')));
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
