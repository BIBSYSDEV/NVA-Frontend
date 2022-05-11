import { RoleName, User } from '../../types/user.types';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import { SET_USER_SUCCESS, UserActions, SET_PARTIAL_USER } from '../actions/userActions';

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
      const nationalIdNumber = action.user['custom:feideIdNin'] ?? action.user['custom:nin'] ?? '';

      const user: User = {
        name: `${firstName} ${lastName}`,
        givenName: firstName,
        familyName: lastName,
        nationalIdNumber,
        id: action.user['custom:feideId'] ?? '',
        cristinId,
        username: action.user['custom:nvaUsername'] ?? '',
        customerId,
        roles,
        topOrgCristinId: action.user['custom:topOrgCristinId'],
        isCreator: !!customerId && roles.includes(RoleName.Creator),
        isAppAdmin: !!customerId && roles.includes(RoleName.AppAdmin),
        isInstitutionAdmin: !!customerId && roles.includes(RoleName.InstitutionAdmin),
        isCurator: !!customerId && roles.includes(RoleName.Curator),
        isEditor: !!customerId && roles.includes(RoleName.Editor),
        viewingScope: [],
        allowedCustomers,
      };
      return user;
    }
    case SET_PARTIAL_USER:
      return state ? { ...state, ...action.partialData } : null;
    case LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};
