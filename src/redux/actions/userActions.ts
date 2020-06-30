import { Authority } from '../../types/authority.types';
import { FeideUser } from '../../types/user.types';

// ACTION TYPES
export const SET_USER_SUCCESS = 'set user';
export const SET_AUTHORITY_DATA = 'set authority data';
export const SET_POSSIBLE_AUTHORITIES = 'set possible authorities';

// ACTION CREATORS
export const setUser = (user: FeideUser | any): SetUserAction => ({
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

export type UserActions = SetUserAction | SetAuthorityAction | SetPossibleAuthoritiesAction;
