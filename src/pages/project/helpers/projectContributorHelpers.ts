import { ProjectContributor } from '../../../types/project.types';
import { isNonProjectManagerRole, isProjectManagerRole } from './projectRoleHelpers';

export const findProjectManagerIndex = (contributors: ProjectContributor[]) => {
  return contributors.findIndex((contributor) => contributor.roles.some((role) => isProjectManagerRole(role)));
};

export const getNonProjectManagerContributors = (contributors: ProjectContributor[]) => {
  return contributors.filter((contributor) => contributor.roles.some((role) => isNonProjectManagerRole(role)));
};

export const hasUnidentifiedContributor = (contributors: ProjectContributor[]) =>
  contributors.some((contributor) => !contributor.identity || !contributor.identity.id);
