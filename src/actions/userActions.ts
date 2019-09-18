import User from '../types/user.types';

// ACTION TYPES
export const SET_USER = 'set user';

// ACTION CREATORS
export const setUser = (user: User) => ({
  type: SET_USER,
  user,
});

export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}

export type UserActions = SetUserAction;
