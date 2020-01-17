import { ApplicationName, emptyUser, RoleName, User } from '../../types/user.types';
import { AuthActions, LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actions/authActions';
import { OrcidActions, SET_ORCID } from '../actions/orcidActions';
import { CLEAR_USER, SET_AUTHORITY_DATA, SET_USER_SUCCESS, UserActions } from '../actions/userActions';

export const userReducer = (state: User = emptyUser, action: UserActions | OrcidActions | AuthActions) => {
  switch (action.type) {
    case CLEAR_USER:
      return {
        ...state,
        ...emptyUser,
      };
    case SET_USER_SUCCESS:
      const roles = action.user['custom:applicationRoles'].split(',') as RoleName[];
      const user: Partial<User> = {
        name: action.user.name,
        email: action.user.email,
        id: action.user['custom:feideId'],
        institution: action.user['custom:orgName'],
        roles,
        application: action.user['custom:application'] as ApplicationName,
        isLoggedIn: true,
      };
      return {
        ...state,
        ...user,
      };
    case SET_ORCID:
      return {
        ...state,
        authority: { ...state.authority, orcids: [...state.authority.orcids, action.orcids] },
      };
    case SET_AUTHORITY_DATA:
      return {
        ...state,
        authority: action.authority,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
