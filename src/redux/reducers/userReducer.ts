import { ApplicationName, RoleName, User, Affiliation } from '../../types/user.types';
import { getOrganizationIdByOrganizationNumber } from '../../utils/customers';
import { AuthActions, LOGOUT_SUCCESS } from '../actions/authActions';
import { OrcidActions, SET_EXTERNAL_ORCID } from '../actions/orcidActions';
import { SET_AUTHORITY_DATA, SET_POSSIBLE_AUTHORITIES, SET_USER_SUCCESS, UserActions } from '../actions/userActions';

export const userReducer = (state: User | null = null, action: UserActions | OrcidActions | AuthActions) => {
  switch (action.type) {
    case SET_USER_SUCCESS:
      let affiliations;
      let roles;
      const feideAffiliations = action.user['custom:affiliation'];
      const feideRoles = action.user['custom:applicationRoles'];
      if (feideAffiliations) {
        affiliations = feideAffiliations
          .replace(/[[\]]/g, '')
          .split(',')
          .map((affiliationString) => affiliationString.trim())
          .filter((affiliation) => affiliation) as Affiliation[];
      }
      if (feideRoles) {
        roles = action.user['custom:applicationRoles'].split(',') as RoleName[];
      }
      const user: Partial<User> = {
        name: action.user.name,
        email: action.user.email,
        id: action.user['custom:feideId'],
        institution: action.user['custom:orgName'],
        roles,
        application: action.user['custom:application'] as ApplicationName,
        organizationId: getOrganizationIdByOrganizationNumber(action.user['custom:orgNumber']),
        affiliations,
        givenName: action.user.given_name,
        familyName: action.user.family_name,
        isPublisher: roles ? roles.some((role) => role === RoleName.PUBLISHER) : false,
        isAppAdmin: roles
          ? roles.some((role) => role === RoleName.APP_ADMIN) || action.user.email.endsWith('@unit.no')
          : false, // TODO: temporarily set app admin role based on email
        isInstitutionAdmin: roles ? roles.some((role) => role === RoleName.ADMIN) : false,
        isCurator: roles ? roles.some((role) => role === RoleName.CURATOR) : false,
        possibleAuthorities: [],
      };
      return user;
    case SET_EXTERNAL_ORCID:
      return {
        ...state,
        externalOrcid: action.orcid,
      };
    case SET_AUTHORITY_DATA:
      return {
        ...state,
        authority: action.authority,
      };
    case SET_POSSIBLE_AUTHORITIES:
      return {
        ...state,
        possibleAuthorities: action.possibleAuthorities,
      };
    case LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
};
