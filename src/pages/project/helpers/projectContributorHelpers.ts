import { ProjectContributor, ProjectContributorRole, ProjectContributorType } from '../../../types/project.types';
import { CristinPerson } from '../../../types/user.types';
import { getValueByKey } from '../../../utils/user-helpers';
import {
  deleteProjectManagerRoleFromContributor,
  findProjectManagerRole,
  isNonProjectManagerRole,
  isProjectManagerRole,
  replaceRolesOnContributor,
} from './projectRoleHelpers';

export const findProjectManagerIndex = (contributors: ProjectContributor[]) => {
  return contributors.findIndex((contributor) => contributor.roles.some((role) => isProjectManagerRole(role)));
};

export const getNonProjectManagerContributors = (contributors: ProjectContributor[]) => {
  return contributors.filter((contributor) => contributor.roles.some((role) => isNonProjectManagerRole(role)));
};

export const hasUnidentifiedContributor = (contributors: ProjectContributor[]) =>
  contributors.some((contributor) => !contributor.identity || !contributor.identity.id);

export enum AddContributorErrors {
  NO_PERSON_TO_ADD,
  NO_SEARCH_TERM,
  SAME_ROLE_WITH_SAME_AFFILIATION,
  ALREADY_HAS_A_PROJECT_MANAGER,
}

export const addContributor = (
  personToAdd: CristinPerson | undefined,
  contributors: ProjectContributor[],
  roleToAddTo: ProjectContributorType
): { newContributors?: ProjectContributor[]; error?: AddContributorErrors } => {
  if (!personToAdd) {
    return { error: AddContributorErrors.NO_PERSON_TO_ADD };
  }

  // Cannot add project manager if we already have one
  if (roleToAddTo === 'ProjectManager') {
    const existingProjectManager = contributors.find((contributor) => findProjectManagerRole(contributor));

    if (existingProjectManager) {
      return { error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER };
    }
  }

  let newContributor: ProjectContributor;

  // If the user to add already exists in the contributor list
  const existingContributorIndex = contributors.findIndex((contributor) => contributor.identity.id === personToAdd.id);

  if (existingContributorIndex > -1) {
    // Cannot have same roletype and affiliation
    const sameRoleAndSameType = contributors[existingContributorIndex].roles.some((role) => {
      return (
        role.type === roleToAddTo &&
        personToAdd.affiliations.some((affiliation) => affiliation.organization === role.affiliation?.id)
      );
    });

    if (sameRoleAndSameType) {
      return { error: AddContributorErrors.SAME_ROLE_WITH_SAME_AFFILIATION };
    }

    // Replace the empty roles on the type
    newContributor = {
      ...contributors[existingContributorIndex],
      roles: contributors[existingContributorIndex].roles.filter(
        (role) => role.type !== roleToAddTo || (role.type === roleToAddTo && role.affiliation)
      ),
    };
  } else {
    newContributor = {
      identity: {
        type: 'Person',
        id: personToAdd.id,
        firstName: getValueByKey('FirstName', personToAdd.names),
        lastName: getValueByKey('LastName', personToAdd.names),
      },
      roles: [],
    };
  }

  // Adding 1 or more affiliations
  if (personToAdd.affiliations.length > 0) {
    newContributor.roles = [...newContributor.roles].concat(
      personToAdd.affiliations
        .filter((_, index) => roleToAddTo !== 'ProjectManager' || index === 0) // For project managers, we only allow one affiliation
        .map((affiliation) => {
          return {
            type: roleToAddTo,
            affiliation: { type: 'Organization', id: affiliation.organization, labels: {} },
          } as ProjectContributorRole;
        })
    );
  } else {
    // Only adding empty role if no other roles present on the role
    if (newContributor.roles.filter((role) => role.type === roleToAddTo).length === 0) {
      newContributor.roles.push({
        type: roleToAddTo,
        affiliation: undefined,
      } as ProjectContributorRole);
    }
  }

  const newContributors = [...contributors];

  if (existingContributorIndex > -1) {
    newContributors[existingContributorIndex] = newContributor;
  } else {
    newContributors.push(newContributor);
  }

  return { newContributors };
};

export const addUnidentifiedProjectContributor = (
  searchTerm: string,
  contributors: ProjectContributor[],
  role: ProjectContributorType,
  indexToReplace = -1
): { newContributors?: ProjectContributor[]; error?: AddContributorErrors } => {
  if (!searchTerm) {
    return { error: AddContributorErrors.NO_SEARCH_TERM };
  }

  // Cannot add project manager if we already have one
  if (role === 'ProjectManager') {
    const existingProjectManager = contributors.find((contributor) => findProjectManagerRole(contributor));

    if (existingProjectManager) {
      return { error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER };
    }
  }

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

  const newContributor: ProjectContributor = {
    identity: {
      type: 'Person',
      firstName: firstName,
      lastName: lastName,
    },
    roles: [],
  };

  if (indexToReplace > -1) {
    newContributor.roles = contributors[indexToReplace].roles;
  } else {
    newContributor.roles = [
      {
        type: role,
        affiliation: undefined,
      } as ProjectContributorRole,
    ];
  }

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
