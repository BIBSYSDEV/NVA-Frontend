import { Affiliation, RoleName, User } from '../../types/user.types';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import {
  SET_AUTHORITY_DATA,
  SET_POSSIBLE_AUTHORITIES,
  SET_ROLES,
  SET_USER_SUCCESS,
  UserActions,
} from '../actions/userActions';

export const userReducer = (
  state: User | null = null,
  action: UserActions | AuthActions
): User | Partial<User> | null => {
  switch (action.type) {
    case SET_USER_SUCCESS: {
      const roles = action.user['custom:applicationRoles'].split(',') as RoleName[];
      const feideAffiliations = action.user['custom:affiliation'];
      const affiliations = feideAffiliations
        ? (feideAffiliations
            .replace(/[[\]]/g, '')
            .split(',')
            .map((affiliationString) => affiliationString.trim())
            .filter((affiliation) => affiliation) as Affiliation[])
        : [];
      const customerId = action.user['custom:customerId']?.endsWith('/customer/None')
        ? ''
        : action.user['custom:customerId'];

      const user: Partial<User> = {
        name: action.user.name,
        email: action.user.email,
        id: action.user['custom:feideId'],
        institution: action.user['custom:orgName'],
        cristinId: action.user['custom:cristinId'] ?? action.user.cristinId,
        customerId,
        affiliations,
        givenName: action.user.given_name,
        familyName: action.user.family_name,
        orgNumber: action.user['custom:orgNumber'],
        isCreator: !!customerId && roles.some((role) => role === RoleName.Creator),
        isAppAdmin: !!customerId && roles.some((role) => role === RoleName.AppAdmin),
        isInstitutionAdmin: !!customerId && roles.some((role) => role === RoleName.InstitutionAdmin),
        isCurator: !!customerId && roles.some((role) => role === RoleName.Curator),
        isEditor: !!customerId && roles.some((role) => role === RoleName.Editor),
      };
      return user;
    }
    case SET_ROLES:
      return {
        ...state,
        isCreator: !!(state?.customerId && action.roles.some((role) => role === RoleName.Creator)),
        isAppAdmin: !!state?.customerId && action.roles.some((role) => role === RoleName.AppAdmin),
        isInstitutionAdmin: !!state?.customerId && action.roles.some((role) => role === RoleName.InstitutionAdmin),
        isCurator: !!state?.customerId && action.roles.some((role) => role === RoleName.Curator),
        isEditor: !!state?.customerId && action.roles.some((role) => role === RoleName.Editor),
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
