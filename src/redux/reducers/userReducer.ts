import { ApplicationName, emptyUser, RoleName, User, Affiliation } from '../../types/user.types';
import { getOrganizationIdByOrganizationNumber } from '../../utils/customers';
import { AuthActions, LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actions/authActions';
import { OrcidActions, SET_EXTERNAL_ORCID } from '../actions/orcidActions';
import {
  CLEAR_USER,
  SET_AUTHORITY_DATA,
  SET_POSSIBLE_AUTHORITIES,
  SET_USER_SUCCESS,
  UserActions,
} from '../actions/userActions';

const publisherAffiliations = [Affiliation.EMPLOYEE, Affiliation.STAFF, Affiliation.MEMBER];
const curatorAffiliations = publisherAffiliations;

export const userReducer = (state: User = emptyUser, action: UserActions | OrcidActions | AuthActions) => {
  switch (action.type) {
    case CLEAR_USER:
      return {
        ...state,
        ...emptyUser,
      };
    case SET_USER_SUCCESS:
      const affiliations = action.user['custom:affiliation']
        .replace(/[[\]]/g, '')
        .split(',')
        .map(affiliationString => affiliationString.trim())
        .filter(affiliation => affiliation) as Affiliation[];
      const roles = action.user['custom:applicationRoles'].split(',') as RoleName[];
      const isLoggedIn = true;
      const email = action.user.email;
      const user: Partial<User> = {
        name: action.user.name,
        email,
        id: action.user['custom:feideId'],
        institution: action.user['custom:orgName'],
        roles,
        application: action.user['custom:application'] as ApplicationName,
        isLoggedIn,
        organizationId: getOrganizationIdByOrganizationNumber(action.user['custom:orgNumber']),
        affiliations,
        givenName: action.user.given_name,
        familyName: action.user.family_name,
        isPublisher: affiliations.some(userAffiliation => publisherAffiliations.includes(userAffiliation)),
        isAppAdmin: email.endsWith('@unit.no'),
        isInstitutionAdmin: roles.some(role => role === RoleName.ADMIN),
        isCurator: affiliations.some(userAffiliation => curatorAffiliations.includes(userAffiliation)),
      };
      return {
        ...state,
        ...user,
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
      };
    case SET_POSSIBLE_AUTHORITIES:
      return {
        ...state,
        possibleAuthorities: action.possibleAuthorities,
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
