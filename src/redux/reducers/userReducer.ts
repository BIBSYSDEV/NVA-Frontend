import { Affiliation, RoleName, User } from '../../types/user.types';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import {
  SET_AUTHORITY_DATA,
  SET_POSSIBLE_AUTHORITIES,
  SET_ROLES,
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
      const feideAffiliations = action.user['custom:affiliation'];
      const affiliations = feideAffiliations
        ? (feideAffiliations
            .replace(/[[\]]/g, '')
            .split(',')
            .map((affiliationString) => affiliationString.trim())
            .filter((affiliation) => affiliation) as Affiliation[])
        : [];
      const roleItems = action.user['custom:roles'].split(',');
      const roles = roleItems.map((roleItem) => roleItem.split('@')[0] as RoleName);
      const customerId = action.user['custom:customerId']?.endsWith('/customer/None')
        ? ''
        : action.user['custom:customerId'];

      const user: Partial<User> = {
        name: `${action.user['custom:firstName']} ${action.user['custom:lastName']}`,
        email: action.user.email,
        id: action.user['custom:feideId'],
        institution: action.user['custom:orgName'],
        cristinId: action.user['custom:cristinId'] ?? action.user.cristinId,
        customerId,
        affiliations,
        givenName: action.user.given_name,
        familyName: action.user.family_name,
        orgNumber: action.user['custom:orgNumber'],
        roles: roles,
        isCreator: !!(customerId && roles.some((role) => role === RoleName.CREATOR)),
        isAppAdmin: !!customerId && roles.some((role) => role === RoleName.APP_ADMIN),
        isInstitutionAdmin: !!customerId && roles.some((role) => role === RoleName.INSTITUTION_ADMIN),
        isCurator: !!customerId && roles.some((role) => role === RoleName.CURATOR),
        isEditor: !!customerId && roles.some((role) => role === RoleName.EDITOR),
      };
      return user;
    }
    case SET_ROLES:
      //TODO: remove?
      return {
        ...state,
        roles: action.roles,
        isCreator: !!(state?.customerId && action.roles.some((role) => role === RoleName.CREATOR)),
        isAppAdmin: !!state?.customerId && action.roles.some((role) => role === RoleName.APP_ADMIN),
        isInstitutionAdmin: !!state?.customerId && action.roles.some((role) => role === RoleName.INSTITUTION_ADMIN),
        isCurator: !!state?.customerId && action.roles.some((role) => role === RoleName.CURATOR),
        isEditor: !!state?.customerId && action.roles.some((role) => role === RoleName.EDITOR),
      };
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
