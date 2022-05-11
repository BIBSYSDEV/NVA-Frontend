import { FeideUser, RoleName, User } from '../../types/user.types';

// ACTION TYPES
export const SET_USER_SUCCESS = 'set user';
export const SET_ROLES = 'set roles';
export const SET_VIEWING_SCOPE = 'set viewing scope';
export const SET_PARTIAL_USER = 'set partial user';

// ACTION CreatorS
export const setUser = (user: FeideUser): SetUserAction => ({
  type: SET_USER_SUCCESS,
  user,
});

export const setRoles = (roles: RoleName[]): SetRolesAction => ({
  type: SET_ROLES,
  roles,
});

export const setViewingScope = (viewingScope: string[]): SetViewingScopeAction => ({
  type: SET_VIEWING_SCOPE,
  viewingScope,
});

export const setPartialUser = (partialData: Partial<User>): SetPartialUserAction => ({
  type: SET_PARTIAL_USER,
  partialData,
});

interface SetPartialUserAction {
  type: typeof SET_PARTIAL_USER;
  partialData: Partial<User>;
}

interface SetViewingScopeAction {
  type: typeof SET_VIEWING_SCOPE;
  viewingScope: string[];
}

interface SetRolesAction {
  type: typeof SET_ROLES;
  roles: RoleName[];
}

interface SetUserAction {
  type: typeof SET_USER_SUCCESS;
  user: FeideUser;
}

export type UserActions = SetUserAction | SetViewingScopeAction | SetRolesAction | SetPartialUserAction;
