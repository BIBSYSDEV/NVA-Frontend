import { RoleName } from './user.types';

interface Role {
  rolename: RoleName;
}

export interface UserRoles {
  institution: string;
  roles: Role[];
  username: string;
}
