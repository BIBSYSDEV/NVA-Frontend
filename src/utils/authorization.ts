import { User, Affiliation, RoleName } from '../types/user.types';

const publisherAffiliations = [Affiliation.EMPLOYEE, Affiliation.STAFF, Affiliation.MEMBER];
const curatorAffiliations = publisherAffiliations;

export const checkIfPublisher = (user: User) =>
  user.isLoggedIn && user.affiliations.some(userAffiliation => publisherAffiliations.includes(userAffiliation));

export const checkIfAppAdmin = (user: User) => user.isLoggedIn && user.email.endsWith('@unit.no');

export const checkIfInstitutionAdmin = (user: User) =>
  user.isLoggedIn && user.roles.find(role => role === RoleName.ADMIN);

export const checkIfCurator = (user: User) =>
  user.isLoggedIn && user.affiliations.some(userAffiliation => curatorAffiliations.includes(userAffiliation));
