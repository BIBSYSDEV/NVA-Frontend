import { User, Affiliation } from '../types/user.types';

const publisherAffiliations = [Affiliation.EMPLOYEE, Affiliation.STAFF, Affiliation.MEMBER];
const curatorAffiliations = publisherAffiliations;

export const checkIfPublisher = (user: User) =>
  user.isLoggedIn && user.affiliations.some(userAffiliation => publisherAffiliations.includes(userAffiliation));

export const checkIfCurator = (user: User) =>
  user.isLoggedIn && user.affiliations.some(userAffiliation => curatorAffiliations.includes(userAffiliation));
