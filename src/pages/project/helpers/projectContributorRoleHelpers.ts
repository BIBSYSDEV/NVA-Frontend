import { ProjectContributor, ProjectContributorRole } from '../../../types/project.types';

export const isProjectManagerRole = (role: ProjectContributorRole) => {
  return role.type === 'ProjectManager';
};

export const isNonProjectManagerRole = (role: ProjectContributorRole) => {
  return role.type !== 'ProjectManager';
};

export const findProjectManagerRoleIndex = (contributor: ProjectContributor) => {
  return contributor.roles.findIndex((role) => isProjectManagerRole(role));
};

export const findProjectManagerRole = (contributor: ProjectContributor) => {
  const projectManagerRoleIndex = findProjectManagerRoleIndex(contributor);

  return projectManagerRoleIndex > -1 ? contributor.roles[projectManagerRoleIndex] : undefined;
};

export const hasUnidentifiedContributor = (contributors: ProjectContributor[]) =>
  contributors.some((contributor) => !contributor.identity.id);

export const replaceRolesOnContributor = (
  contributors: ProjectContributor[],
  contributorIndex: number,
  newRoles: ProjectContributorRole[]
) => {
  const newContributors = [...contributors];
  const newContributor = { ...contributors[contributorIndex] };
  newContributor.roles = newRoles;
  newContributors[contributorIndex] = newContributor;
  return newContributors;
};

export const deleteRoleFromContributor = (
  contributors: ProjectContributor[],
  contributorIndex: number,
  roleIndex: number
) => {
  const newRoles = [...contributors[contributorIndex].roles];
  newRoles.splice(roleIndex, 1);
  return replaceRolesOnContributor(contributors, contributorIndex, newRoles);
};

export const deleteProjectManagerRoleFromContributor = (contributors: ProjectContributor[]) => {
  const projectManagerIndex = contributors.findIndex((c) => c.roles.some((role) => isProjectManagerRole(role)));
  const projectManager = contributors[projectManagerIndex];
  const projectManagerRoleIndex = projectManager?.roles.findIndex((role) => isProjectManagerRole(role));

  return projectManagerRoleIndex > -1
    ? deleteRoleFromContributor(contributors, projectManagerIndex, projectManagerRoleIndex)
    : contributors;
};

const rolesHaveEmptyAffiliation = (roles: ProjectContributorRole[]) => {
  return roles.some((role) => role.affiliation === undefined);
};

export const getRelevantContributorRoles = (contributor: ProjectContributor, isProjectManager: boolean) => {
  return contributor.roles.filter((role) =>
    isProjectManager ? isProjectManagerRole(role) : isNonProjectManagerRole(role)
  );
};

export const contributorHasEmptyAffiliation = (roles: ProjectContributorRole[]) => {
  return rolesHaveEmptyAffiliation(roles);
};

export const checkIfSameAffiliationOnSameRoleType = (
  newAffiliationId: string,
  role: ProjectContributorRole,
  isProjectManager: boolean
) => {
  const isSameRoleType =
    (isProjectManager && isProjectManagerRole(role)) || (!isProjectManager && isNonProjectManagerRole(role));
  return role.affiliation?.type === 'Organization' && role.affiliation?.id === newAffiliationId && isSameRoleType;
};
