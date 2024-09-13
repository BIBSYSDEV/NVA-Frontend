import { ProjectContributor, ProjectContributorRole, ProjectContributorType } from '../../../types/project.types';
import { CristinPerson } from '../../../types/user.types';
import { getValueByKey } from '../../../utils/user-helpers';
import { findProjectManagerRole, isNonProjectManagerRole, isProjectManagerRole } from './projectRoleHelpers';

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
  SAME_ROLE_WITH_SAME_AFFILIATION,
  ALREADY_HAS_A_PROJECT_MANAGER,
}

export const addContributor = (
  personToAdd: CristinPerson | undefined,
  contributors: ProjectContributor[],
  roleToAddTo: ProjectContributorType
): { newContributors?: ProjectContributor[]; error?: AddContributorErrors } => {
  // Must have person to add
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
    // Adding no affiliations
    newContributor.roles = [
      ...newContributor.roles,
      {
        type: roleToAddTo,
        affiliation: undefined,
      } as ProjectContributorRole,
    ];
  }

  const newContributors = [...contributors];

  if (existingContributorIndex > -1) {
    newContributors[existingContributorIndex] = newContributor;
  } else {
    newContributors.push(newContributor);
  }

  return { newContributors };
};
