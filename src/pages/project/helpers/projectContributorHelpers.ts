import { ProjectContributor, ProjectContributorRole } from '../../../types/project.types';
import { isNonProjectManagerRole, isProjectManagerRole } from './projectRoleHelpers';

export const findProjectManagerIndex = (contributors: ProjectContributor[]) => {
  return contributors.findIndex((contributor) => contributor.roles.some((role) => isProjectManagerRole(role)));
};

export const getNonProjectManagerContributors = (contributors: ProjectContributor[]) => {
  return contributors.filter((contributor) => contributor.roles.some((role) => isNonProjectManagerRole(role)));
};

const rolesAreEqual = (r1: ProjectContributorRole[], r2: ProjectContributorRole[]) => {
  if (r1.length !== r2.length) return false;

  r1.forEach((role, index) => {
    if (role.type !== r2[index].type) return false;
    if (role.affiliation !== r2[index].affiliation) return false;
  });

  return true;
};

export const contributorsAreEqual = (c1: ProjectContributor, c2: ProjectContributor) => {
  if (c1.identity.id && c2.identity.id) return c1.identity.id === c2.identity.id;
  else if ((!c1.identity.id && c2.identity.id) || (c1.identity.id && !c2.identity.id)) return false;
  else
    return (
      c1.identity.type === c2.identity.type &&
      c1.identity.firstName === c2.identity.firstName &&
      c1.identity.lastName === c2.identity.lastName &&
      rolesAreEqual(c1.roles, c2.roles)
    );
};
