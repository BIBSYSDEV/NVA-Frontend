import { OrcidActions, SET_ORCID_INFO } from '../actions/orcidActions';
import { CLEAR_USER, SET_USER_SUCCESS, UserActions } from '../actions/userActions';
import User, { emptyUser } from '../types/user.types';

export const userReducer = (state: User = emptyUser, action: UserActions | OrcidActions) => {
  switch (action.type) {
    case CLEAR_USER:
      return {
        ...state,
        ...emptyUser,
      };
    case SET_USER_SUCCESS:
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
