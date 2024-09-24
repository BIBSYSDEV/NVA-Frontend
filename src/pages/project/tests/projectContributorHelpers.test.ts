import { describe, expect, it } from 'vitest';
import {
  addContributor,
  AddContributorErrors,
  removeProjectManager,
  removeProjectParticipant,
} from '../helpers/projectContributorHelpers.js';
import {
  abcOrgAsAffiliation,
  contributorsArrayWithContributorsWithOnlyManagerRole,
  contributorsArrayWithContributorsWithOnlyParticipantRole,
  contributorsArrayWithContributorWithBothPMRoleAndParticipantRole,
  contributorsArrayWithDifferentProjectManagerWithDifferentAffiliation,
  contributorsArrayWithDifferentProjectManagerWithSameAffiliation,
  contributorsArrayWithDifferentProjectManagerWithUndefinedAffiliation,
  contributorsArrayWithNoProjectManager,
  contributorsArrayWithOtherPersonWithDifferentAffiliation,
  contributorsArrayWithOtherPersonWithSameAffiliation,
  contributorsArrayWithOtherPersonWithUndefinedAffiliation,
  contributorsArrayWithOtherPMAndUndefinedAffiliation,
  contributorsArrayWithProjectManager,
  contributorsArrayWithSelectedPersonAsProjectManagerWithDifferentAffiliation,
  contributorsArrayWithSelectedPersonAsProjectManagerWithNoAffiliation,
  contributorsArrayWithSelectedPersonAsProjectManagerWithSameAffiliation,
  contributorsArrayWithSelectedPersonWithDifferentAffiliation,
  contributorsArrayWithSelectedPersonWithSameAffiliation,
  contributorsArrayWithSelectedPersonWithUndefinedAffiliation,
  contributorsArrayWithUndefinedPMAffiliationAndOtherContributor,
  defOrgAsAffiliation,
  existingPersonIdentity,
  selectedPersonIdentity,
  selectedPersonWithAffiliation,
  selectedPersonWithoutAffiliation,
} from './mockObjects';

describe('addContributor', () => {
  describe('when adding a project manager with affiliation', () => {
    it('if there is already a project manager in the contributors array it returns an error', () => {
      expect(
        addContributor(selectedPersonWithAffiliation, contributorsArrayWithProjectManager, 'ProjectManager')
      ).toEqual({
        error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER,
      });
    });
    describe('when there exists a project participant with the same id', () => {
      it('and the existing project participant has an affiliation with the same id, it adds a new "ProjectManager" role with the added affiliation to the existing user. The existing user keeps its other role.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithSameAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the existing project participant only has an affiliation with a different id, it adds a new "ProjectManager" role with the added affiliation to the existing project participant. The contributor keeps its other role.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithDifferentAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: defOrgAsAffiliation,
                },
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the existing contributor only has an affiliation that is undefined, it adds a new "ProjectManager" role with the added affiliation to the existing user. The contributor keeps its undefined role.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithUndefinedAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists another contributor with a different id', () => {
      it('when the other contributor has an affiliation with the same id, it adds a new "ProjectManager" contributor with the added affiliation in a role', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithSameAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the other contributor only has an affiliation with a different id, it adds a new "ProjectManager" contributor with the added affiliation in a role to a new user', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithDifferentAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: defOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the other contributor only has an affiliation that is undefined, it adds a new "ProjectManager" contributor with the added affiliation in a role to a new user', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithUndefinedAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there are no other contributors', () => {
      it('the chosen person is added with role type "ProjectManager" and the added affiliation', () => {
        expect(addContributor(selectedPersonWithAffiliation, [], 'ProjectManager')).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
  });
  describe('when adding a project manager without affiliation', () => {
    it('if there is already a project manager in the contributors array it returns an error', () => {
      expect(
        addContributor(selectedPersonWithoutAffiliation, contributorsArrayWithProjectManager, 'ProjectManager')
      ).toEqual({
        error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER,
      });
    });
    describe('when there exists a project contributor with the same id', () => {
      it('when the existing project contributor only has an affiliation with an affiliation, it adds a new "ProjectManager" role with an empty affiliation to the existing user. The existing project contributor keeps its role.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonWithDifferentAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: defOrgAsAffiliation,
                },
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
      it('when the existing contributor only has an affiliation that is undefined, it adds a new "ProjectManager" role with an empty affiliation to the existing user . The contributor keeps its undefined role.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonWithUndefinedAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists another contributor with a different id', () => {
      it('when the other contributor has an affiliation, it adds a new "ProjectManager" contributor with an empty affiliation', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithOtherPersonWithDifferentAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: defOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
      it('when the other  contributor only has an affiliation that is undefined, it adds a new "ProjectManager" contributor with with an empty affiliation', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithOtherPersonWithUndefinedAffiliation,
            'ProjectManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there are no other contributors', () => {
      it('the chosen person is added with role "ProjectManager" and affiliation undefined', () => {
        expect(addContributor(selectedPersonWithoutAffiliation, [], 'ProjectManager')).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
  });
  describe('when adding a project contributor with affiliation', () => {
    it('the chosen person is added with role "ProjectParticipant" and affiliation with id', () => {
      expect(addContributor(selectedPersonWithAffiliation, [], 'ProjectParticipant')).toEqual({
        newContributors: [
          {
            identity: selectedPersonIdentity,
            roles: [
              {
                type: 'ProjectParticipant',
                affiliation: abcOrgAsAffiliation,
              },
            ],
          },
        ],
      });
    });
    describe('when there exists a project contributor with the same id', () => {
      it('when the existing contributor has an affiliation with the same id it returns an error', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithSameAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          error: AddContributorErrors.SAME_ROLE_WITH_SAME_AFFILIATION,
        });
      });
      it('when the existing contributor only has an affiliation with a different id, it adds a new "ProjectParticipant" role with the added affiliation to the existing user.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithDifferentAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: defOrgAsAffiliation,
                },
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the existing contributor only has an affiliation that is undefined, it replaces the existing undefined role with a new "ProjectParticipant" role with the added affiliation', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithUndefinedAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project contributor with a different id', () => {
      it('when the other contributor has an affiliation with the same id, it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user .The other project participant keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithSameAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the other contributor only has an affiliation with a different id, it adds a new "ProjectParticipant" contributor with the added affiliation in a role. The other contributor keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithDifferentAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: defOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the other contributor only has an affiliation that is undefined, it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user . The other contributor keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithUndefinedAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with the same id', () => {
      it('when the project manager has an affiliation with the same id, it adds a new "ProjectParticipant" role with the added affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithSameAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation with a different id, it adds a new "ProjectParticipant" role with the added affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithDifferentAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: defOrgAsAffiliation,
                },
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation that is undefined it adds a new "ProjectParticipant" role with the added affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithNoAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with a different id', () => {
      it('when the project manager has an affiliation with the same id, it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user. The the project manager keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithDifferentProjectManagerWithSameAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation with a different id, it adds a new "ProjectParticipant" contributor with the added affiliation in a role. The project manager keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithDifferentProjectManagerWithDifferentAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: defOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the when the project manager only has an affiliation that is undefined, it adds a new "ProjectParticipant" contributor with the added affiliation in a role. The project manager keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithDifferentProjectManagerWithUndefinedAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
  });
  describe('when adding a project contributor without affiliation', () => {
    it('the chosen person is added with role with type project participant and affiliation undefined', () => {
      expect(addContributor(selectedPersonWithoutAffiliation, [], 'ProjectParticipant')).toEqual({
        newContributors: [
          {
            identity: selectedPersonIdentity,
            roles: [
              {
                type: 'ProjectParticipant',
                affiliation: undefined,
              },
            ],
          },
        ],
      });
    });
    describe('when there exists a project contributor with the same id', () => {
      it('when there is an existing contributor with the same id, it does nothing.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonWithSameAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project contributor with a different id', () => {
      it('it adds a new "ProjectParticipant" contributor with an undefined affiliation. The other contributor keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithOtherPersonWithUndefinedAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with the same id', () => {
      it('when the project manager only has an other affiliation, it adds a new "ProjectParticipant" role with an undefined affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithDifferentAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: defOrgAsAffiliation,
                },
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation that is undefined, it adds a new "ProjectParticipant" role with an undefined affiliation. The project manager keeps its undefined project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithNoAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with a different id', () => {
      it('when the when the project manager has an affiliation, it adds a new "ProjectParticipant" contributor with an undefined affiliation. The project manager keeps its role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithDifferentProjectManagerWithDifferentAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: defOrgAsAffiliation,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation that is undefined, it adds a new "ProjectParticipant" contributor with an undefined affiliation. The project manager keeps its undefined role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithDifferentProjectManagerWithUndefinedAffiliation,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [
                {
                  type: 'ProjectManager',
                  affiliation: undefined,
                },
              ],
            },
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'ProjectParticipant',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
  });
});

describe('remove project participant', () => {
  it('when they also have a project manager role, it removes all project participant roles on the participant, but keeps the user and its project manager role', () => {
    expect(removeProjectParticipant(contributorsArrayWithContributorWithBothPMRoleAndParticipantRole, 0)).toEqual([
      {
        identity: selectedPersonIdentity,
        roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }],
      },
      {
        identity: existingPersonIdentity,
        roles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      },
    ]);
  });
  it('when they only have project participant roles, it removes the whole user object', () => {
    expect(removeProjectParticipant(contributorsArrayWithContributorsWithOnlyParticipantRole, 0)).toEqual([
      {
        identity: existingPersonIdentity,
        roles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      },
    ]);
  });
  it('when they only have a project participant role with undefined affiliation, it removes the whole user object', () => {
    expect(removeProjectParticipant(contributorsArrayWithOtherPMAndUndefinedAffiliation, 1)).toEqual([
      {
        identity: existingPersonIdentity,
        roles: [
          { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      },
    ]);
  });
  it('when the index to delete is negative, it returns an unchanged object', () => {
    expect(removeProjectParticipant(contributorsArrayWithOtherPMAndUndefinedAffiliation, -1)).toEqual(
      contributorsArrayWithOtherPMAndUndefinedAffiliation
    );
  });
});

describe('remove project manager', () => {
  it('when they also have other roles, it removes project manager role on the participant, but keeps the user and its other roles', () => {
    expect(removeProjectManager(contributorsArrayWithContributorWithBothPMRoleAndParticipantRole)).toEqual([
      {
        identity: selectedPersonIdentity,
        roles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      },
      {
        identity: existingPersonIdentity,
        roles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      },
    ]);
  });
  it('when project manager role is the only role, it removes the whole user object', () => {
    expect(removeProjectManager(contributorsArrayWithContributorsWithOnlyManagerRole)).toEqual([
      {
        identity: existingPersonIdentity,
        roles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      },
    ]);
  });
  it('when they only have a project manager role with undefined affiliation, it removes the whole user object', () => {
    expect(removeProjectManager(contributorsArrayWithUndefinedPMAffiliationAndOtherContributor)).toEqual([
      {
        identity: existingPersonIdentity,
        roles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      },
    ]);
  });
  it('when there is no project manager, it returns an unchanged object', () => {
    expect(removeProjectManager(contributorsArrayWithNoProjectManager)).toEqual(contributorsArrayWithNoProjectManager);
  });
});
