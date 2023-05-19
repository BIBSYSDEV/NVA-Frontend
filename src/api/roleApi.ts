import { InstitutionUser, UserRole } from '../types/user.types';
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
  const userResponse = await authenticatedApiRequest2<InstitutionUser>({
    url: `${RoleApiPath.Users}/${username}`,
  });
  return userResponse.data;
};
