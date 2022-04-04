import { RoleName, User } from '../../types/user.types';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import {
  SET_AUTHORITY_DATA,
  SET_POSSIBLE_AUTHORITIES,
  SET_VIEWING_SCOPE,
  SET_USER_SUCCESS,
  UserActions,
} from '../actions/userActions';

export const userReducer = (
  state: User | null = null,
  action: UserActions | AuthActions
): User | Partial<User> | null => {
  switch (action.type) {
    case SET_USER_SUCCESS: {
      const roleItems = action.user['custom:roles']?.split(',') ?? [];
      const roles = roleItems.map((roleItem) => roleItem.split('@')[0] as RoleName);
      const customerId = action.user['custom:customerId']?.endsWith('/customer/None')
        ? ''
        : action.user['custom:customerId'];

      const user: Partial<User> = {
        name: `${action.user['custom:firstName']} ${action.user['custom:lastName']}`,
        givenName: action.user['custom:firstName'],
        familyName: action.user['custom:lastName'],
        id: action.user['custom:feideId'],
        cristinId: action.user['custom:cristinId'],
        customerId,
        roles: roles,
        isCreator: !!(customerId && roles.some((role) => role === RoleName.CREATOR)),
        isAppAdmin: !!customerId && roles.some((role) => role === RoleName.APP_ADMIN),
        isInstitutionAdmin: !!customerId && roles.some((role) => role === RoleName.INSTITUTION_ADMIN),
        isCurator: !!customerId && roles.some((role) => role === RoleName.CURATOR),
        isEditor: !!customerId && roles.some((role) => role === RoleName.EDITOR),
        viewingScope: [],
      };
      return user;
    }
    case SET_VIEWING_SCOPE:
      return {
        ...state,
        viewingScope: action.viewingScope,
      };
    case SET_AUTHORITY_DATA:
      return {
        ...state,
        authority: action.authority,
        possibleAuthorities: undefined,
      };
    case SET_POSSIBLE_AUTHORITIES:
      return {
        ...state,
        authority: undefined,
        possibleAuthorities: action.possibleAuthorities,
      };
    case LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};
