import { RoleName, User } from '../../types/user.types';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import { SET_VIEWING_SCOPE, SET_USER_SUCCESS, UserActions } from '../actions/userActions';

export const userReducer = (
  state: User | null = null,
  action: UserActions | AuthActions
): User | Partial<User> | null => {
  switch (action.type) {
    case SET_USER_SUCCESS: {
      const customerId = action.user['custom:customerId']?.endsWith('/customer/None')
        ? ''
        : action.user['custom:customerId'];
      const roleItems =
        action.user['custom:roles']?.split(',').map((roleItem) => roleItem.split('@') as [RoleName, string]) ?? [];
      const roles = roleItems.filter(([_, thisCustomerId]) => thisCustomerId === customerId).map(([role]) => role);
      const firstName = action.user['custom:firstName'] ?? '';
      const lastName = action.user['custom:lastName'] ?? '';

      const user: Partial<User> = {
        name: `${firstName} ${lastName}`,
        givenName: firstName,
        familyName: lastName,
        id: action.user['custom:feideId'] ?? '',
        cristinId: action.user['custom:cristinId'],
        customerId,
        roles,
        isCreator: !!customerId && roles.includes(RoleName.CREATOR),
        isAppAdmin: !!customerId && roles.includes(RoleName.APP_ADMIN),
        isInstitutionAdmin: !!customerId && roles.includes(RoleName.INSTITUTION_ADMIN),
        isCurator: !!customerId && roles.includes(RoleName.CURATOR),
        isEditor: !!customerId && roles.includes(RoleName.EDITOR),
        viewingScope: [],
      };
      return user;
    }
    case SET_VIEWING_SCOPE:
      return {
        ...state,
        viewingScope: action.viewingScope,
      };
    case LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};
