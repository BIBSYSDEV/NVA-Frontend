import { InstitutionUser, RoleName, UserList } from '../types/user.types';
import { getFullName } from '../utils/user-helpers';
import { RoleApiPath } from './apiPaths';
import { authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';

interface CreateUserPayload extends Pick<InstitutionUser, 'roles' | 'viewingScope'> {
  nationalIdentityNumber: string;
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
    // If the user already exists, the API will return 200 without persisting the data
    const updateUserPayload: InstitutionUser = {
      ...newUserPayload,
      username: createUserResponse.data.username,
      institution: createUserResponse.data.institution,
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

export const fetchUsers = async (customerId: string, role: RoleName | RoleName[]) => {
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
