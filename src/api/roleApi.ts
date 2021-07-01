import { InstitutionUser } from '../types/user.types';
import { RoleApiPath } from './apiPaths';
import { authenticatedApiRequest } from './apiRequest';

export const updateUser = async (username: string, newUser: InstitutionUser) =>
  await authenticatedApiRequest<InstitutionUser>({
    url: `${RoleApiPath.Users}/${encodeURIComponent(username)}`,
    method: 'PUT',
    data: newUser,
  });
