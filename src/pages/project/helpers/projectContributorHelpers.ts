import { ProjectContributor, ProjectContributorRole, ProjectContributorType } from '../../../types/project.types';
import { CristinPerson, CristinPersonAffiliation } from '../../../types/user.types';
import { getValueByKey } from '../../../utils/user-helpers';
import {
  addRoles,
  deleteProjectManagerRoleFromContributor,
  findProjectManagerRole,
  hasEmptyAffiliation,
  isProjectManagerRole,
  replaceRolesOnContributor,
} from './projectRoleHelpers';

export const findProjectManagerIndex = (contributors: ProjectContributor[]) => {
  return contributors.findIndex((contributor) => contributor.roles.some((role) => isProjectManagerRole(role)));
};

export const getContributorsWithRelevantRole = (
  contributors: ProjectContributor[],
  roleType: ProjectContributorType
) => {
  return contributors.filter((contributor) => contributor.roles.some((role) => role.type === roleType));
};

export enum AddContributorErrors {
  NO_PERSON_TO_ADD,
  INDEX_OUT_OF_BOUNDS,
  NO_SEARCH_TERM,
  SAME_ROLE_WITH_SAME_AFFILIATION,
  ALREADY_HAS_A_PROJECT_MANAGER,
  CANNOT_ADD_ANOTHER_PROJECT_MANAGER_ROLE,
  CAN_ONLY_REPLACE_UNIDENTIFIED_CONTRIBUTORS,
  CAN_ONLY_ADD_ONE_PROJECT_MANAGER_ROLE,
  MUST_HAVE_ROLE_OF_TYPE_TO_BE_IDENTIFIED,
}

const checkIfExistingProjectManager = (contributors: ProjectContributor[], indexToReplace: number) => {
  const indexOfExistingProjectManager = contributors.findIndex((contributor) => findProjectManagerRole(contributor));

  // It's ok to have an existing Project Manager if we are going to replace it
  if (indexOfExistingProjectManager > -1 && indexToReplace !== indexOfExistingProjectManager) {
    return AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER;
  }
};

const checkIfDefinedProjectManagerRole = (contributors: ProjectContributor[]) => {
  const indexOfExistingProjectManager = contributors.findIndex((contributor) => findProjectManagerRole(contributor));

  if (indexOfExistingProjectManager > -1) {
    const existingProjectManager = contributors[indexOfExistingProjectManager];
    const existingProjectManagerRole = findProjectManagerRole(existingProjectManager);

    // It's ok to have an existing Project Manager if its affiliation is undefined
    if (existingProjectManagerRole && !hasEmptyAffiliation(existingProjectManagerRole)) {
      return AddContributorErrors.CANNOT_ADD_ANOTHER_PROJECT_MANAGER_ROLE;
    }
  }
};

const checkIfRoleAndTypeDuplicate = (
  personToAdd: CristinPerson,
  roles: ProjectContributorRole[],
  roleToAddTo: ProjectContributorType
) => {
  const sameRoleAndSameType = roles.some(
    (role) =>
      role.type === roleToAddTo &&
      personToAdd.affiliations.some((affiliation) => affiliation.organization === role.affiliation?.id)
  );

  if (sameRoleAndSameType) {
    return AddContributorErrors.SAME_ROLE_WITH_SAME_AFFILIATION;
  }
};

const addEmptyRoleIfNecessary = (existingRoles: ProjectContributorRole[], roleToAddTo: ProjectContributorType) => {
  if (existingRoles.filter((role) => role.type === roleToAddTo).length === 0) {
    return [
      ...existingRoles,
      {
        type: roleToAddTo,
        affiliation: undefined,
      } as ProjectContributorRole,
    ];
  }
  return existingRoles;
};

const isAlreadyAdded = (
  existingRoles: ProjectContributorRole[],
  cristinAffiliation: CristinPersonAffiliation,
  roleToAddTo: ProjectContributorType
) => {
  return existingRoles.some(
    (role) => role.type === roleToAddTo && role.affiliation?.id === cristinAffiliation.organization
  );
};

export const addContributor = (
  personToAdd: CristinPerson | undefined,
  contributors: ProjectContributor[],
  roleToAddTo: ProjectContributorType,
  indexToReplace = -1
): { newContributors?: ProjectContributor[]; error?: AddContributorErrors } => {
  if (!personToAdd) {
    return { error: AddContributorErrors.NO_PERSON_TO_ADD };
  }

  if (indexToReplace > contributors.length - 1 || indexToReplace < -1) {
    return { error: AddContributorErrors.INDEX_OUT_OF_BOUNDS };
  }

  if (indexToReplace > -1 && contributors[indexToReplace].identity.id) {
    return { error: AddContributorErrors.CAN_ONLY_REPLACE_UNIDENTIFIED_CONTRIBUTORS };
  }

  if (roleToAddTo === 'ProjectManager') {
    if (personToAdd.affiliations.length > 1) {
      return { error: AddContributorErrors.CAN_ONLY_ADD_ONE_PROJECT_MANAGER_ROLE };
    }

    const projectManagerError = checkIfExistingProjectManager(contributors, indexToReplace);
    if (projectManagerError) return { error: projectManagerError }; // Can only replace, not add Project Manager if we already have one

    if (personToAdd.affiliations.length > 0) {
      const projectManagerErrorRoleError = checkIfDefinedProjectManagerRole(contributors);
      if (projectManagerErrorRoleError) return { error: projectManagerErrorRoleError }; // Can not add affiliations if the project manager has one
    }
  }

  // The UI only makes available an identify-button on roles that exist, so this is mostly to ensure the tests are correct
  if (indexToReplace > -1 && !contributors[indexToReplace].roles.some((role) => role.type === roleToAddTo)) {
    return { error: AddContributorErrors.MUST_HAVE_ROLE_OF_TYPE_TO_BE_IDENTIFIED };
  }

  const newContributor: ProjectContributor = {
    identity: {
      type: 'Person',
      id: personToAdd.id,
      firstName: getValueByKey('FirstName', personToAdd.names),
      lastName: getValueByKey('LastName', personToAdd.names),
    },
    roles: [],
  };

  // Check if the user to add already exists in the contributor list
  const existingContributorIndex = contributors.findIndex((contributor) => contributor.identity.id === personToAdd.id);

  if (existingContributorIndex > -1) {
    // The existing contributor cannot have same affiliation on the same role type as the person to add
    const roleAndTypeDuplicateError = checkIfRoleAndTypeDuplicate(
      personToAdd,
      contributors[existingContributorIndex].roles,
      roleToAddTo
    );
    if (roleAndTypeDuplicateError) return { error: roleAndTypeDuplicateError };

    // Add affiliations from the existing participant since we are merging them
    newContributor.roles = addRoles(newContributor.roles, contributors[existingContributorIndex].roles, roleToAddTo);
  }

  // If we are replacing an index we must keep its affiliations as well
  if (indexToReplace > -1) {
    newContributor.roles = addRoles(newContributor.roles, contributors[indexToReplace].roles, roleToAddTo);
  }

  // Adding 1 or more affiliations from the selected user
  if (personToAdd.affiliations.length > 0) {
    newContributor.roles = newContributor.roles.concat(
      personToAdd.affiliations
        .filter((cristinAffiliation) => !isAlreadyAdded(newContributor.roles, cristinAffiliation, roleToAddTo))
        .map((affiliation) => {
          return {
            type: roleToAddTo,
            affiliation: { type: 'Organization', id: affiliation.organization, labels: {} },
          } as ProjectContributorRole;
        })
    );
  } else {
    newContributor.roles = addEmptyRoleIfNecessary(newContributor.roles, roleToAddTo);
  }

  const newContributors = [...contributors];

  if (indexToReplace > -1) {
    newContributors[indexToReplace] = newContributor;
    if (existingContributorIndex > -1 && indexToReplace !== existingContributorIndex) {
      newContributors.splice(existingContributorIndex, 1);
    }
  } else if (existingContributorIndex > -1) {
    newContributors[existingContributorIndex] = newContributor;
  } else {
    newContributors.push(newContributor);
  }

  return { newContributors };
};

const createNamesFromInput = (searchTerm: string) => {
  const names = searchTerm.split(' ');
  let firstName, lastName;

  if (names.length > 1) {
    const namesWithoutLastName = names.slice(0, -1);
    firstName = namesWithoutLastName.join(' ');
    lastName = names[names.length - 1];
  } else {
    firstName = names[0];
    lastName = '';
  }

  return { firstName, lastName };
};

export const addUnidentifiedProjectContributor = (
  searchTerm: string,
  contributors: ProjectContributor[],
  roleToAddTo: ProjectContributorType,
  indexToReplace = -1
): { newContributors?: ProjectContributor[]; error?: AddContributorErrors } => {
  if (!searchTerm) {
    return { error: AddContributorErrors.NO_SEARCH_TERM };
  }

  // Cannot add project manager if we already have one
  if (roleToAddTo === 'ProjectManager') {
    const projectManagerError = checkIfExistingProjectManager(contributors, indexToReplace);
    if (projectManagerError) return { error: projectManagerError };
  }

  const { firstName, lastName } = createNamesFromInput(searchTerm);

  const newContributor: ProjectContributor = {
    identity: {
      type: 'Person',
      firstName: firstName,
      lastName: lastName,
    },
    roles: [],
  };

  // If we are replacing an index we must keep its roles
  if (indexToReplace > -1) {
    newContributor.roles = addRoles(newContributor.roles, contributors[indexToReplace].roles, roleToAddTo);
  }

  // It needs at least one role to contain the role type
  newContributor.roles = addEmptyRoleIfNecessary(newContributor.roles, roleToAddTo);

  const newContributors = [...contributors];

  if (indexToReplace > -1) {
    newContributors[indexToReplace] = newContributor;
  } else {
    newContributors.push(newContributor);
  }

  return { newContributors: newContributors };
};

export const removeProjectParticipant = (contributors: ProjectContributor[], contributorIndex: number) => {
  if (contributorIndex < 0) {
    return contributors;
  }
  const projectManagerRole = findProjectManagerRole(contributors[contributorIndex]);

  // Contributor also has Project manager role: Only delete all the other roles
  if (projectManagerRole) {
    return replaceRolesOnContributor(contributors, contributorIndex, [projectManagerRole]);
  }
  // Does not have project manager role: Delete the whole contributor
  const newContributors = [...contributors];
  newContributors.splice(contributorIndex, 1);
  return newContributors;
};

export const removeProjectManager = (contributors: ProjectContributor[]) => {
  const projectManagerIndex = findProjectManagerIndex(contributors);

  if (projectManagerIndex < 0) {
    return contributors;
  }

  const projectManager = contributors[projectManagerIndex];

  // Project manager has other roles on project: only delete the project manager-role
  if (projectManager.roles.length > 1) {
    return deleteProjectManagerRoleFromContributor(contributors);
  }
  // Project manager is only role: remove contributor
  const newContributors = [...contributors];
  newContributors.splice(projectManagerIndex, 1);
  return newContributors;
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
