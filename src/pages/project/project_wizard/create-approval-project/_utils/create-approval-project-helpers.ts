import { ProjectContributor, ProjectOrganization } from '../../../../../types/project.types';
import { User } from '../../../../../types/user.types';

/** Creates a project manager contributor for the user, affiliated with the given institution */
export const createProjectManagerFromUser = (
  user: Pick<User, 'cristinId' | 'givenName' | 'familyName'>,
  institution: ProjectOrganization
): ProjectContributor => ({
  identity: { type: 'Person', id: user.cristinId, firstName: user.givenName, lastName: user.familyName },
  roles: [
    {
      type: 'ProjectManager',
      affiliation: { type: 'Organization', id: institution.id, labels: institution.labels },
    },
  ],
});
