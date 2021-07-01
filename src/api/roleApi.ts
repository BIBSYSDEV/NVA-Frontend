import { InstitutionUser } from '../types/user.types';
import { RoleApiPath } from './apiPaths';
import { authenticatedApiRequest } from './apiRequest';

export const getInstitutionUser = async (username: string) =>
  await authenticatedApiRequest<InstitutionUser>({ url: `${RoleApiPath.Users}/${encodeURIComponent(username)}` }); // error: t('feedback:error.get_roles')

export const updateUser = async (username: string, newUser: InstitutionUser) =>
  await authenticatedApiRequest<InstitutionUser>({
    url: `${RoleApiPath.Users}/${encodeURIComponent(username)}`,
    method: 'PUT',
    data: newUser,
  });
