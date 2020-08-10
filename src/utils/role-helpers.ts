import { InstitutionUser, RoleName } from '../types/user.types';

export const filterUsersByRole = (users: InstitutionUser[], roleFilter: RoleName) =>
  users.filter((user) => user.roles.some((role) => role.rolename === roleFilter));
