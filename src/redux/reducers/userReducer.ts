import { RoleName, User } from '../../types/user.types';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import { SET_VIEWING_SCOPE, SET_USER_SUCCESS, UserActions, SET_ROLES } from '../actions/userActions';

export const userReducer = (state: User | null = null, action: UserActions | AuthActions): User | null => {
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
      const cristinId = ''; // action.user['custom:cristinId'] ?? '';
      const allowedCustomers = action.user['custom:allowedCustomers']?.split(',') ?? [];

      const user: User = {
        name: `${firstName} ${lastName}`,
        givenName: firstName,
        familyName: lastName,
        nationalIdNumber: action.user['custom:feideIdNin'] ?? '',
        id: action.user['custom:feideId'] ?? '',
        cristinId,
        username: action.user['custom:nvaUsername'] ?? '',
        customerId,
        roles,
        topOrgCristinId: action.user['custom:topOrgCristinId'],
        isCreator: !!customerId && roles.includes(RoleName.CREATOR),
        isAppAdmin: !!customerId && roles.includes(RoleName.APP_ADMIN),
        isInstitutionAdmin: !!customerId && roles.includes(RoleName.INSTITUTION_ADMIN),
        isCurator: !!customerId && roles.includes(RoleName.CURATOR),
        isEditor: !!customerId && roles.includes(RoleName.EDITOR),
        viewingScope: [],
        allowedCustomers,
      };
      return user;
    }
    case SET_ROLES: {
      // This is used to update roles from cypress
      const hasCustomerId = !!state?.customerId;
      return {
        ...state,
        roles: action.roles,
        isCreator: hasCustomerId && action.roles.includes(RoleName.CREATOR),
        isAppAdmin: hasCustomerId && action.roles.includes(RoleName.APP_ADMIN),
        isInstitutionAdmin: hasCustomerId && action.roles.includes(RoleName.INSTITUTION_ADMIN),
        isCurator: hasCustomerId && action.roles.includes(RoleName.CURATOR),
        isEditor: hasCustomerId && action.roles.includes(RoleName.EDITOR),
      } as User;
    }
    case SET_VIEWING_SCOPE:
      return {
        ...state,
        viewingScope: action.viewingScope,
      } as User;
    case LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};
