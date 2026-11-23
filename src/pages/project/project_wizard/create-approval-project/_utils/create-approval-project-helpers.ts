import { Approval } from '../../../../../types/approval.types';
import { ProjectContributor, ProjectOrganization, SaveCristinProject } from '../../../../../types/project.types';
import { User } from '../../../../../types/user.types';
import { toNewProjectApproval } from '../../../../../utils/approval-helpers';

/**
 * Creates a project manager contributor for the user, affiliated with the given institution.
 * The affiliation is left empty when the institution has no id, so the user can choose it in the project form.
 */
export const createProjectManagerFromUser = (
  user: Pick<User, 'cristinId' | 'givenName' | 'familyName'>,
  institution: ProjectOrganization
): ProjectContributor => ({
  identity: { type: 'Person', id: user.cristinId, firstName: user.givenName, lastName: user.familyName },
  roles: [
    {
      type: 'ProjectManager',
      affiliation: institution.id
        ? { type: 'Organization', id: institution.id, labels: institution.labels }
        : undefined,
    },
  ],
});

/**
 * Creates the new project for an approval: the title comes from the approval, the approval is attached when its source
 * is supported, and the user becomes project manager at the coordinating institution.
 */
export const createProjectFromApproval = (
  newProject: SaveCristinProject,
  approval: Approval,
  user: Pick<User, 'cristinId' | 'givenName' | 'familyName'> | null,
  coordinatingInstitution: ProjectOrganization
): SaveCristinProject => {
  const projectApproval = toNewProjectApproval(approval);

  return {
    ...newProject,
    title: approval.title,
    coordinatingInstitution,
    contributors: user ? [createProjectManagerFromUser(user, coordinatingInstitution)] : newProject.contributors,
    approvals: projectApproval ? [projectApproval] : [],
  };
};
