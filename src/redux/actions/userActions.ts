import { FeideUser, User } from '../../types/user.types';

export const SET_USER_SUCCESS = 'set user';
export const SET_PARTIAL_USER = 'set partial user';

export const setUser = (user: FeideUser): SetUserAction => ({
  type: SET_USER_SUCCESS,
  user,
});

export const setPartialUser = (partialData: Partial<User>): SetPartialUserAction => ({
  type: SET_PARTIAL_USER,
  partialData,
});

interface SetPartialUserAction {
  type: typeof SET_PARTIAL_USER;
  partialData: Partial<User>;
}

interface SetUserAction {
  type: typeof SET_USER_SUCCESS;
  user: FeideUser;
}

export type UserActions = SetUserAction | SetPartialUserAction;
