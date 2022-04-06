import { FeideUser } from '../../types/user.types';

// ACTION TYPES
export const SET_USER_SUCCESS = 'set user';
export const SET_VIEWING_SCOPE = 'set viewing scope';

// ACTION CREATORS
export const setUser = (user: FeideUser): SetUserAction => ({
  type: SET_USER_SUCCESS,
  user,
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

export type UserActions = SetUserAction | SetViewingScopeAction;
