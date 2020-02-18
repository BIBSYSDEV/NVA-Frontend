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
import { ADD_INSTITUTION_PRESENTATION, InstitutionActions } from '../actions/institutionActions';

export const userReducer = (
  state: User = emptyUser,
  action: UserActions | OrcidActions | AuthActions | InstitutionActions
) => {
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
        .map(affiliationString => affiliationString.trim()) as Affiliation[];
      const roles = action.user['custom:applicationRoles'].split(',') as RoleName[];
      const user: Partial<User> = {
        name: action.user.name,
        email: action.user.email,
        id: action.user['custom:feideId'],
        institution: action.user['custom:orgName'],
        roles,
        application: action.user['custom:application'] as ApplicationName,
        isLoggedIn: true,
        organizationId: getOrganizationIdByOrganizationNumber(action.user['custom:orgNumber']),
        affiliations,
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
    case ADD_INSTITUTION_PRESENTATION:
      return {
        ...state,
        institutionPresentations: [...state.institutionPresentations, action.institutionPresentation],
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
