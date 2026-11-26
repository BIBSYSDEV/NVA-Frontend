import { describe, expect, test } from 'vitest';
import { Approval } from '../../../../../types/approval.types';
import { emptyProject, ProjectOrganization } from '../../../../../types/project.types';
import { createProjectFromApproval } from './create-approval-project-helpers';

const institution: ProjectOrganization = {
  type: 'Organization',
  id: 'https://api.dev.nva.aws.unit.no/cristin/organization/185.0.0.0',
  labels: { nb: 'Universitetet i Oslo' },
};

const user = {
  cristinId: 'https://api.dev.nva.aws.unit.no/cristin/person/1',
  givenName: 'Ola',
  familyName: 'Nordmann',
};

const makeApproval = (identifierName: string): Approval => ({
  type: 'Approval',
  id: 'https://api.dev.nva.aws.unit.no/approval/1',
  handle: 'https://hdl.handle.net/11250.1/1',
  title: 'A study of diabetes',
  identifiers: [{ type: 'Identifier', name: identifierName, value: '123456' }],
});

describe('createProjectFromApproval()', () => {
  test('Uses the approval title, attaches the approval and adds the user as project manager', () => {
    const project = createProjectFromApproval(emptyProject, makeApproval('REK'), user, institution);

    expect(project.title).toBe('A study of diabetes');
    expect(project.coordinatingInstitution).toEqual(institution);
    expect(project.contributors).toEqual([
      {
        identity: { type: 'Person', id: user.cristinId, firstName: 'Ola', lastName: 'Nordmann' },
        roles: [
          {
            type: 'ProjectManager',
            affiliation: { type: 'Organization', id: institution.id, labels: institution.labels },
          },
        ],
      },
    ]);
    expect(project.approvals).toMatchObject([{ authority: 'RegionalEthicalCommittees', identifier: '123456' }]);
  });

  test('Leaves the affiliation of the project manager empty when the institution has no id', () => {
    const institutionWithoutId: ProjectOrganization = { type: 'Organization', id: '', labels: {} };
    const project = createProjectFromApproval(emptyProject, makeApproval('REK'), user, institutionWithoutId);

    expect(project.contributors[0].roles).toEqual([{ type: 'ProjectManager', affiliation: undefined }]);
  });

  test('Attaches no approval when the approval has no REK or DMP identifier', () => {
    expect(createProjectFromApproval(emptyProject, makeApproval('Unknown'), user, institution).approvals).toEqual([]);
  });

  test.each([
    ['there is no user', null],
    ['the user has no Cristin id', { ...user, cristinId: undefined }],
  ])('Keeps the existing contributors when %s', (_, projectUser) => {
    const project = createProjectFromApproval(emptyProject, makeApproval('REK'), projectUser, institution);

    expect(project.contributors).toEqual(emptyProject.contributors);
  });
});
