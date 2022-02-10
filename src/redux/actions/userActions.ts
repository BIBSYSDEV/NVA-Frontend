import { Authority } from '../../types/authority.types';
import { FeideUser, RoleName } from '../../types/user.types';

// ACTION TYPES
export const SET_USER_SUCCESS = 'set user';
export const SET_AUTHORITY_DATA = 'set authority data';
export const SET_POSSIBLE_AUTHORITIES = 'set possible authorities';
export const SET_ROLES = 'set roles';
export const SET_SCOPE = 'set scope';

// ACTION CREATORS
export const setUser = (user: FeideUser): SetUserAction => ({
  type: SET_USER_SUCCESS,
  user,
});

export const setAuthorityData = (authority: Authority): SetAuthorityAction => ({
  type: SET_AUTHORITY_DATA,
  authority,
});

export const setPossibleAuthorities = (possibleAuthorities: Authority[]): SetPossibleAuthoritiesAction => ({
  type: SET_POSSIBLE_AUTHORITIES,
  possibleAuthorities,
});

export const setRoles = (roles: RoleName[]): SetRolesAction => ({
  type: SET_ROLES,
  roles,
});

export const setViewingScope = (scope: string[]): SetScopeAction => ({
  type: SET_SCOPE,
  scope,
});

interface SetScopeAction {
  type: typeof SET_SCOPE;
  scope: string[];
}

interface SetRolesAction {
  type: typeof SET_ROLES;
  roles: RoleName[];
}

interface SetUserAction {
  type: typeof SET_USER_SUCCESS;
  user: FeideUser;
}

interface SetAuthorityAction {
  type: typeof SET_AUTHORITY_DATA;
  authority: Authority;
}

interface SetPossibleAuthoritiesAction {
  type: typeof SET_POSSIBLE_AUTHORITIES;
  possibleAuthorities: Authority[];
}

export type UserActions =
  | SetUserAction
  | SetAuthorityAction
  | SetPossibleAuthoritiesAction
  | SetRolesAction
  | SetScopeAction;
