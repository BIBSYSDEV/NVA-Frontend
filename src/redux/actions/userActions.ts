import { VariantType } from 'notistack';

import { Authority } from '../../types/authority.types';
import { FeideUser } from '../../types/user.types';

// ACTION TYPES
export const CLEAR_USER = 'clear user';
export const SET_USER_SUCCESS = 'set user';
export const SET_USER_FAILURE = 'set user failure';
export const SET_AUTHORITY_DATA = 'set authority data';
export const SET_POSSIBLE_AUTHORITIES = 'set possible authorities';

// ACTION CREATORS
export const clearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});

export const setUser = (user: FeideUser): SetUserAction => ({
  type: SET_USER_SUCCESS,
  user,
});

export const setUserFailure = (message: string): SetUserFailureAction => ({
  type: SET_USER_FAILURE,
  message,
  variant: 'error',
});

export const setAuthorityData = (authority: Authority): SetAuthorityAction => ({
  type: SET_AUTHORITY_DATA,
  authority,
});

export const setPossibleAuthories = (possibleAuthorities: Authority[]): SetPossibleAuthoritiesAction => ({
  type: SET_POSSIBLE_AUTHORITIES,
  possibleAuthorities,
});

interface ClearUserAction {
  type: typeof CLEAR_USER;
}
interface SetUserAction {
  type: typeof SET_USER_SUCCESS;
  user: FeideUser;
}

interface SetAuthorityAction {
  type: typeof SET_AUTHORITY_DATA;
  authority: Authority;
}

interface SetUserFailureAction {
  type: typeof SET_USER_FAILURE;
  message: string;
  variant: VariantType;
}

interface SetPossibleAuthoritiesAction {
  type: typeof SET_POSSIBLE_AUTHORITIES;
  possibleAuthorities: Authority[];
}

export type UserActions =
  | ClearUserAction
  | SetUserAction
  | SetUserFailureAction
  | SetAuthorityAction
  | SetPossibleAuthoritiesAction;
