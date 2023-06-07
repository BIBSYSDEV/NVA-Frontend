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

export const fetchUsers = async (customerId: string, role: RoleName) => {
  const usersResponse = await authenticatedApiRequest2<UserList>({
    url: `${RoleApiPath.InstitutionUsers}?institution=${customerId}`,
  });
  const filteredUsers = usersResponse.data.users.filter((user) =>
    user.roles.some((userRole) => userRole.rolename === role)
  );
  return filteredUsers.sort((a, b) => {
    const nameA = getFullName(a.givenName, a.familyName);
    const nameB = getFullName(b.givenName, b.familyName);
    return nameA.localeCompare(nameB);
  });
};
