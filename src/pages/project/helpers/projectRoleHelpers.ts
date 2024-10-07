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

export const contributorHasNonEmptyAffiliation = (roles: ProjectContributorRole[]) => {
  return roles.some((role) => role.affiliation !== undefined);
};

export const hasEmptyAffiliation = (role: ProjectContributorRole) => {
  return role.affiliation === undefined || role.affiliation.id === '' || role.affiliation.id === undefined;
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

export const getRelevantContributorRoles = (contributor: ProjectContributor, roleType: ProjectContributorType) => {
  return contributor.roles.filter((role) => role.type === roleType);
};

const checkIfSameAffiliationOnSameRoleType = (
  newAffiliationId: string,
  role: ProjectContributorRole,
  roleType: ProjectContributorType
) => {
  return (
    role.affiliation?.type === 'Organization' && role.affiliation?.id === newAffiliationId && roleType === role.type
  );
};

const findAffiliationOnCorrectRoleType = (
  roles: ProjectContributorRole[],
  affiliationId: string,
  roleType: ProjectContributorType
) => {
  return roles.findIndex((role) => role.affiliation?.id === affiliationId && role.type === roleType);
};

export const isAlreadyInExistingRoles = (existingRoles: ProjectContributorRole[], role: ProjectContributorRole) => {
  const existingRole = existingRoles.find((r) => r.affiliation?.id === role.affiliation?.id && r.type === role.type);
  return existingRole !== undefined;
};

export const addRoles = (
  existingRoles: ProjectContributorRole[],
  rolesToAdd: ProjectContributorRole[],
  roleToAddTo: ProjectContributorType
) => {
  // Not adding roles of same type that are empty or roles that already exist in the array
  return existingRoles.concat(
    rolesToAdd.filter(
      (role) =>
        !isAlreadyInExistingRoles(existingRoles, role) && (role.type !== roleToAddTo || !hasEmptyAffiliation(role))
    )
  );
};

const findRoleIndexForAffiliation = (
  roleType: ProjectContributorType,
  roles: ProjectContributorRole[],
  affiliationId: string
) => {
  return findAffiliationOnCorrectRoleType(roles, affiliationId, roleType);
};

const notLastOfItsRoleType = (
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
  roleType: ProjectContributorType,
  labels?: LanguageString
): { newContributorRoles?: ProjectContributorRole[]; error?: AffiliationErrors } => {
  const asProjectManager = roleType === 'ProjectManager';

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
  if (contributorRoles.some((role) => checkIfSameAffiliationOnSameRoleType(newAffiliationId, role, roleType))) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
    };
  }

  const emptyRoleIndex = contributorRoles.findIndex((role) => hasEmptyAffiliation(role) && role.type === roleType);

  const newAffiliation: ProjectOrganization = {
    type: 'Organization',
    id: newAffiliationId,
    labels: labels || {},
  };

  const newContributorRoles = [...contributorRoles];

  if (emptyRoleIndex < 0) {
    newContributorRoles.push({
      type: roleType,
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
  roleType: ProjectContributorType,
  labels?: LanguageString
): { newContributorRoles?: ProjectContributorRole[]; error?: AffiliationErrors } => {
  if (!newAffiliationId) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_AFFILIATION_ID,
    };
  }

  const roleToChangeIndex = contributorRoles.findIndex(
    (role) => role.affiliation?.id === affiliationToEditId && role.type === roleType
  );

  if (roleToChangeIndex < 0) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_ROLE_TO_CHANGE,
    };
  }

  // If user tries to change affiliation to an already existing affiliation
  if (contributorRoles.some((role) => checkIfSameAffiliationOnSameRoleType(newAffiliationId, role, roleType))) {
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
  roleType: ProjectContributorType
) => {
  if (!affiliationId) {
    return {
      newContributorRoles: contributorRoles,
      error: AffiliationErrors.NO_AFFILIATION_ID,
    };
  }
  const indexOfRoleThatHasAffiliation = findRoleIndexForAffiliation(roleType, contributorRoles, affiliationId);

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
    newRoles[indexOfRoleThatHasAffiliation] = { ...roleToDelete, affiliation: undefined };
  }

  return { newContributorRoles: newRoles };
};
