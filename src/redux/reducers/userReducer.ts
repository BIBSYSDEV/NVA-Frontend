import { Affiliation, RoleName, User } from '../../types/user.types';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import { OrcidActions, SET_EXTERNAL_ORCID } from '../actions/orcidActions';
import {
  SET_AUTHORITY_DATA,
  SET_POSSIBLE_AUTHORITIES,
  SET_ROLES,
  SET_USER_SUCCESS,
  UserActions,
} from '../actions/userActions';

export const userReducer = (
  state: User | null = null,
  action: UserActions | OrcidActions | AuthActions
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

      const user: Partial<User> = {
        name: action.user.name,
        email: action.user.email,
        id: action.user['custom:feideId'],
        institution: action.user['custom:orgName'],
        cristinId: action.user['custom:cristinId'] ?? action.user.cristinId,
        customerId: action.user['custom:customerId']?.endsWith('/customer/None')
          ? ''
          : action.user['custom:customerId'],
        affiliations,
        givenName: action.user.given_name,
        familyName: action.user.family_name,
        orgNumber: action.user['custom:orgNumber'],
      };
      return user;
    }
    case SET_ROLES:
      return {
        ...state,
        roles: action.roles,
        isCreator: !!(state?.customerId && action.roles.some((role) => role === RoleName.CREATOR)),
        isAppAdmin: !!state?.customerId && action.roles.some((role) => role === RoleName.APP_ADMIN),
        isInstitutionAdmin: !!state?.customerId && action.roles.some((role) => role === RoleName.INSTITUTION_ADMIN),
        isCurator: !!state?.customerId && action.roles.some((role) => role === RoleName.CURATOR),
        isEditor: !!state?.customerId && action.roles.some((role) => role === RoleName.EDITOR),
      };
    case SET_EXTERNAL_ORCID:
      return {
        ...state,
        externalOrcid: action.orcid,
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
