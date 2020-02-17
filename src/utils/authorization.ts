import { User, Affiliation } from '../types/user.types';

const publisherAffiliations = [Affiliation.EMPLOYEE, Affiliation.STAFF, Affiliation.MEMBER];

export const checkIfPublisher = (user: User) =>
  user.isLoggedIn && user.affiliations.some(userAffiliation => publisherAffiliations.includes(userAffiliation));
