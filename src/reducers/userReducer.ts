import { SET_ORCID_INFO, SET_USER, UserActions } from '../actions/userActions';
import User, { emptyUser } from '../types/user.types';

export const userReducer = (state: User = emptyUser, action: UserActions) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.user,
      };
    case SET_ORCID_INFO:
      return {
        ...state,
        orcidName: action.name,
        orcid: action.orcid,
      };
    default:
      return state;
  }
};
