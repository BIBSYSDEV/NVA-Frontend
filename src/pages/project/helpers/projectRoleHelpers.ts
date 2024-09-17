import { LanguageString } from '../../../types/common.types';
import {
  ProjectContributor,
  ProjectContributorRole,
  ProjectContributorType,
  ProjectOrganization,
} from '../../../types/project.types';

export const isProjectManagerRole = (role: ProjectContributorRole) => {
  return role.type === 'ProjectManager';
};

export const isNonProjectManagerRole = (role: ProjectContributorRole) => {
  return role.type !== 'ProjectManager';
};

export const hasEmptyAffiliation = (role: ProjectContributorRole) => {
  return role.affiliation?.id === '' || role.affiliation?.id === undefined;
};

export const findProjectManagerRole = (contributor: ProjectContributor) => {
  return contributor.roles.find(isProjectManagerRole);
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

export enum AddAffiliationErrors {
  NO_AFFILIATION_ID,
  CAN_ONLY_BE_ONE_PROJECT_MANAGER,
  ADD_DUPLICATE_AFFILIATION,
}

export const addAffiliation = (
  newAffiliationId: string,
  contributorRoles: ProjectContributorRole[],
  asProjectManager = false,
  labels?: LanguageString
): { newContributorRoles?: ProjectContributorRole[]; error?: AddAffiliationErrors } => {
  if (!newAffiliationId) {
    return {
      newContributorRoles: contributorRoles,
      error: AddAffiliationErrors.NO_AFFILIATION_ID,
    };
  }

  // There can only be one project manager role
  if (asProjectManager && contributorRoles.some((role) => isProjectManagerRole(role) && !hasEmptyAffiliation(role))) {
    return {
      newContributorRoles: contributorRoles,
      error: AddAffiliationErrors.CAN_ONLY_BE_ONE_PROJECT_MANAGER,
    };
  }

  // Avoid adding same unit twice
  if (contributorRoles.some((role) => checkIfSameAffiliationOnSameRoleType(newAffiliationId, role, asProjectManager))) {
    return {
      newContributorRoles: contributorRoles,
      error: AddAffiliationErrors.ADD_DUPLICATE_AFFILIATION,
    };
  }

  const emptyRoleIndex = contributorRoles.findIndex(
    (role) =>
      hasEmptyAffiliation(role) &&
      ((asProjectManager && role.type === 'ProjectManager') ||
        (!asProjectManager && role.type === 'ProjectParticipant'))
  );

  const newAffiliation: ProjectOrganization = {
    type: 'Organization',
    id: newAffiliationId,
    labels: labels || {},
  };

  const newContributorRoles = [...contributorRoles];

  if (emptyRoleIndex < 0) {
    newContributorRoles.push({
      type: asProjectManager ? 'ProjectManager' : 'ProjectParticipant',
      affiliation: newAffiliation,
    } as ProjectContributorRole);
  } else {
    newContributorRoles[emptyRoleIndex] = {
      ...contributorRoles[emptyRoleIndex],
      affiliation: newAffiliation,
    };
  }

  return { newContributorRoles: newContributorRoles };
};
