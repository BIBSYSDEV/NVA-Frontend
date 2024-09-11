import { ProjectContributor, ProjectContributorRole, ProjectContributorType } from '../../../types/project.types';

export const isProjectManagerRole = (role: ProjectContributorRole) => {
  return role.type === 'ProjectManager';
};

export const isNonProjectManagerRole = (role: ProjectContributorRole) => {
  return role.type !== 'ProjectManager';
};

export const findProjectManagerRole = (contributor: ProjectContributor) => {
  return contributor.roles.find(isProjectManagerRole);
};

export const findNonProjectManagerRole = (contributor: ProjectContributor) => {
  return contributor.roles.find(isNonProjectManagerRole);
};

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

const deleteRoleFromContributor = (contributors: ProjectContributor[], contributorIndex: number, roleIndex: number) => {
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

export const getRelevantContributorRoles = (contributor: ProjectContributor, isProjectManager: boolean) => {
  return contributor.roles.filter((role) =>
    isProjectManager ? isProjectManagerRole(role) : isNonProjectManagerRole(role)
  );
};

export const contributorHasEmptyAffiliation = (roles: ProjectContributorRole[]) => {
  return roles.some((role) => role.affiliation === undefined);
};

export const contributorHasNonEmptyAffiliation = (roles: ProjectContributorRole[]) => {
  return roles.some((role) => role.affiliation !== undefined);
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

const findProjectManagerRoleThatHasAffiliation = (contributor: ProjectContributor, affiliationId: string) => {
  return contributor.roles.findIndex((role) => role.affiliation?.id === affiliationId && isProjectManagerRole(role));
};

const findNonProjectManagerRoleThatHasAffiliation = (contributor: ProjectContributor, affiliationId: string) => {
  return contributor.roles.findIndex((role) => role.affiliation?.id === affiliationId && isNonProjectManagerRole(role));
};

export const findRoleIndexForAffiliation = (
  asProjectManager: boolean,
  contributor: ProjectContributor,
  affiliationId: string
) => {
  return asProjectManager
    ? findProjectManagerRoleThatHasAffiliation(contributor, affiliationId)
    : findNonProjectManagerRoleThatHasAffiliation(contributor, affiliationId);
};

export const notLastOfItsRoleType = (
  contributor: ProjectContributor,
  affiliationId: string,
  roleType: ProjectContributorType
) => {
  const rolesWithoutAffiliationId = contributor.roles.filter((role) => role.affiliation?.id !== affiliationId);
  return rolesWithoutAffiliationId.some((role) => role.type === roleType);
};

export const removeEmptyAffiliationsWithinRoletype = (
  roles: ProjectContributorRole[],
  roleType: ProjectContributorType
) => roles.filter((role) => (role.type === roleType && role.affiliation?.id) || role.type !== roleType);
