import { describe, expect, test } from 'vitest';
import { ProjectOrganization } from '../../../../../types/project.types';
import { createProjectManagerFromUser } from './create-approval-project-helpers';

const institution: ProjectOrganization = {
  type: 'Organization',
  id: 'https://api.dev.nva.aws.unit.no/cristin/organization/185.0.0.0',
  labels: { nb: 'Universitetet i Oslo' },
};

describe('createProjectManagerFromUser()', () => {
  test('Adds the user as project manager affiliated with the institution', () => {
    const user = {
      cristinId: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
      givenName: 'Ola',
      familyName: 'Nordmann',
    };

    expect(createProjectManagerFromUser(user, institution)).toEqual({
      identity: { type: 'Person', id: user.cristinId, firstName: 'Ola', lastName: 'Nordmann' },
      roles: [
        {
          type: 'ProjectManager',
          affiliation: { type: 'Organization', id: institution.id, labels: institution.labels },
        },
      ],
    });
  });
});
