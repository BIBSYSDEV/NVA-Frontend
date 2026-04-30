import { useFetchUsersByCustomer } from '../../../api/hooks/useFetchUsersByCustomer';
import { RoleName } from '../../../types/user.types';

export const useInstitutionUsersByRole = (id?: string) => {
  const usersQuery = useFetchUsersByCustomer(id);
  const users = usersQuery.data;

  const editor = users?.find((user) => user.roles.some((role) => role.rolename === RoleName.Editor));
  const institutionAdmin = users?.find((user) =>
    user.roles.some((role) => role.rolename === RoleName.InstitutionAdmin)
  );
  const nviCurators = users?.filter((user) => user.roles.some((role) => role.rolename === RoleName.NviCurator));

  return { editor, institutionAdmin, nviCurators, isLoading: usersQuery.isLoading, isError: usersQuery.isError };
};
