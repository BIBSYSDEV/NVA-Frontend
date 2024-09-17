import { LanguageString } from '../../../types/common.types';
import { Organization } from '../../../types/organization.types';
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

const findProjectManagerRoleThatHasAffiliation = (roles: ProjectContributorRole[], affiliationId: string) => {
  return roles.findIndex((role) => role.affiliation?.id === affiliationId && isProjectManagerRole(role));
};

const findNonProjectManagerRoleThatHasAffiliation = (roles: ProjectContributorRole[], affiliationId: string) => {
  return roles.findIndex((role) => role.affiliation?.id === affiliationId && isNonProjectManagerRole(role));
};

export const findRoleIndexForAffiliation = (
  asProjectManager: boolean,
  roles: ProjectContributorRole[],
  affiliationId: string
) => {
  return asProjectManager
    ? findProjectManagerRoleThatHasAffiliation(roles, affiliationId)
    : findNonProjectManagerRoleThatHasAffiliation(roles, affiliationId);
};

export const notLastOfItsRoleType = (
  roles: ProjectContributorRole[],
  affiliationId: string,
  roleType: ProjectContributorType
) => {
  const rolesWithoutAffiliationId = roles.filter((role) => role.affiliation?.id !== affiliationId);
  return rolesWithoutAffiliationId.some((role) => role.type === roleType);
};

export enum AffiliationErrors {
  NO_AFFILIATION_ID,
  CAN_ONLY_BE_ONE_PROJECT_MANAGER,
  ADD_DUPLICATE_AFFILIATION,
  NO_ROLE_TO_CHANGE,
  NO_ROLE_TO_REMOVE,
}

export const addAffiliation = (
  newAffiliationId: string,
  contributorRoles: ProjectContributorRole[],
  asProjectManager = false,
  labels?: LanguageString
): { newContributorRoles?: ProjectContributorRole[]; error?: AffiliationErrors } => {
  if (!newAffiliationId) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_AFFILIATION_ID,
    };
  }

  // There can only be one project manager role
  if (asProjectManager && contributorRoles.some((role) => isProjectManagerRole(role) && !hasEmptyAffiliation(role))) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.CAN_ONLY_BE_ONE_PROJECT_MANAGER,
    };
  }

  // Avoid adding same unit twice
  if (contributorRoles.some((role) => checkIfSameAffiliationOnSameRoleType(newAffiliationId, role, asProjectManager))) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
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

export const editAffiliation = (
  newAffiliationId: string,
  contributorRoles: ProjectContributorRole[],
  affiliationToEditId: string,
  asProjectManager = false,
  labels?: LanguageString
): { newContributorRoles?: ProjectContributorRole[]; error?: AffiliationErrors } => {
  if (!newAffiliationId) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_AFFILIATION_ID,
    };
  }

  const roleToChangeIndex = contributorRoles.findIndex((role) => role.affiliation?.id === affiliationToEditId);

  if (roleToChangeIndex < 0) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_ROLE_TO_CHANGE,
    };
  }

  // If user tries to change affiliation to an already existing affiliation
  if (contributorRoles.some((role) => checkIfSameAffiliationOnSameRoleType(newAffiliationId, role, asProjectManager))) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
    };
  }

  const newAffiliation: ProjectOrganization = {
    type: 'Organization',
    id: newAffiliationId,
    labels: labels || {},
  };

  const newContributorRoles = [...contributorRoles];

  newContributorRoles[roleToChangeIndex] = {
    ...contributorRoles[roleToChangeIndex],
    affiliation: newAffiliation,
  };

  return { newContributorRoles: newContributorRoles };
};

export const removeAffiliation = (
  affiliationId: string,
  contributorRoles: ProjectContributorRole[],
  asProjectManager = false
) => {
  if (!affiliationId) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_AFFILIATION_ID,
    };
  }

  const indexOfRoleThatHasAffiliation = findRoleIndexForAffiliation(asProjectManager, contributorRoles, affiliationId);

  if (indexOfRoleThatHasAffiliation < 0) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_ROLE_TO_REMOVE,
    };
  }

  const roleToDelete = contributorRoles[indexOfRoleThatHasAffiliation];
  const notLastOfItsType = notLastOfItsRoleType(contributorRoles, affiliationId, roleToDelete.type);
  const newRoles = [...contributorRoles];

  // If it's not the last role it's unproblematic to remove the whole role
  if (notLastOfItsType) {
    newRoles.splice(indexOfRoleThatHasAffiliation, 1);
  } else {
    // Since we're just supposed to remove the affiliation and not the whole role/user row, we have to keep the last role of its type
    const newRole = { ...roleToDelete };
    newRole.affiliation = undefined;
    newRoles[indexOfRoleThatHasAffiliation] = newRole;
  }

  return { newContributorRoles: newRoles };
};
