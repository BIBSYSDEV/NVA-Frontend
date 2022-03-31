import { Authority } from '../../types/authority.types';
import { FeideUser } from '../../types/user.types';

// ACTION TYPES
export const SET_USER_SUCCESS = 'set user';
export const SET_AUTHORITY_DATA = 'set authority data';
export const SET_POSSIBLE_AUTHORITIES = 'set possible authorities';
export const SET_VIEWING_SCOPE = 'set viewing scope';

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

export const setViewingScope = (viewingScope: string[]): SetViewingScopeAction => ({
  type: SET_VIEWING_SCOPE,
  viewingScope,
});

interface SetViewingScopeAction {
  type: typeof SET_VIEWING_SCOPE;
  viewingScope: string[];
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

export type UserActions = SetUserAction | SetAuthorityAction | SetPossibleAuthoritiesAction | SetViewingScopeAction;
