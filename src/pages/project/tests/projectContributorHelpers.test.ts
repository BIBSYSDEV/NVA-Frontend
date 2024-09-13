import { describe, expect, it } from 'vitest';
import { addContributor } from '../helpers/projectContributorHelpers.js';
import {
  abcOrgAsAffiliation,
  selectedPersonIdentity,
  selectedPersonWithAffiliation,
  selectedPersonWithoutAffiliation,
} from './mockObjects';

describe('addContributor', () => {
  describe('when adding a project manager with affiliation', () => {
    it('if there is already a project manager in the contributors array it returns an error', async () => {
      /* */
    });
    describe('when there exists a project contributor with the same id', () => {
      it('it adds a new "ProjectManager" role with the added affiliation to the existing user when the existing contributor has an affiliation with the same id. The contributor keeps its role.', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" role with the added affiliation to the existing user when the existing contributor only has an affiliation with a different id. The contributor keeps its role.', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" role with the added affiliation to the existing user when the existing contributor only has an affiliation that is undefined. The contributor keeps its undefined role.', async () => {
        /* */
      });
    });
    describe('when there exists another contributor with a different id', () => {
      it('it adds a new "ProjectManager" contributor with the added affiliation in a role to a new user when the other contributor has an affiliation with the same id', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" contributor with the added affiliation in a role to a new user when the other contributor only has an affiliation with a different id', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" contributor with the added affiliation in a role to a new user when the other  contributor only has an affiliation that is undefined', async () => {
        /* */
      });
    });
    describe('when there are no other contributors', () => {
      it('the chosen person is added with role type "ProjectManager" and the added affiliation', async () => {
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
    it('if there is already a project manager in the contributors array it returns an error', async () => {
      /* */
    });
    it('the chosen person is added with role "ProjectManager" and affiliation undefined', async () => {
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
    describe('when there exists a project contributor with the same id', () => {
      it('it adds a new "ProjectManager" role with an empty affiliation to the existing user when the existing contributor has an affiliation with the same id. The contributor keeps its role.', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" role with an empty affiliation to the existing user when the existing contributor only has an affiliation with a different id. The contributor keeps its role.', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" role with an empty affiliation to the existing user when the existing contributor only has an affiliation that is undefined. The contributor keeps its undefined role.', async () => {
        /* */
      });
    });
    describe('when there exists another contributor with a different id', () => {
      it('it adds a new "ProjectManager" contributor with an empty affiliation in a role to a new user when the other contributor has an affiliation with the same id', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" contributor with an empty affiliation in a role to a new user when the other contributor only has an affiliation with a different id', async () => {
        /* */
      });
      it('it adds a new "ProjectManager" contributor with with an empty affiliation in a role to a new user when the other  contributor only has an affiliation that is undefined', async () => {
        /* */
      });
    });
  });

  describe('when adding a project contributor with affiliation', () => {
    it('the chosen person is added with role "ProjectParticipant" and affiliation with id', async () => {
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
      it('it returns an error when the existing contributor has an affiliation with the same id', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" role with the added affiliation to the existing user when the existing contributor only has an affiliation with a different id.', async () => {
        /* */
      });
      it('it replaces the existing undefined role with a new "ProjectParticipant" role with the added affiliation to the existing contributor when the existing contributor only has an affiliation that is undefined.', async () => {
        /* */
      });
    });
    describe('when there exists a project contributor with a different id', () => {
      it('it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user when the other contributor has an affiliation with the same id. The other contributor keeps its roles unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user when the other contributor only has an affiliation with a different id. The other contributor keeps its roles unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user when the other  contributor only has an affiliation that is undefined. The other contributor keeps its roles unchanged.', async () => {
        /* */
      });
    });
    describe('when there exists a project manager with the same id', () => {
      it('it adds a new "ProjectParticipant" role with the added affiliation when the project manager has an affiliation with the same id. The project manager keeps its project manager role unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" role with the added affiliation when the project manager only has an affiliation with a different id. The project manager keeps its project manager role unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" role with the added affiliation project manager only has an affiliation that is undefined. The project manager keeps its project manager role unchanged.', async () => {
        /* */
      });
    });
    describe('when there exists a project manager with a different id', () => {
      it('it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user when the project manager has an affiliation with the same id. The when the project manager keeps its roles unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user when the when the project manager only has an affiliation with a different id. The when the project manager keeps its roles unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" contributor with the added affiliation in a role to a new user when the when the project manager only has an affiliation that is undefined. The when the project manager keeps its roles unchanged.', async () => {
        /* */
      });
    });
  });
  describe('when adding a project contributor without affiliation', () => {
    it('the chosen person is added with role with type project participant and affiliation undefined', async () => {
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
      it('it does nothing when there is an existing contributor with the same id. The existing contributor keeps its roles unchanged', async () => {
        /* */
      });
    });
    describe('when there exists a project contributor with a different id', () => {
      it('it adds a new "ProjectParticipant" contributor with an undefined affiliation. The other contributor keeps its roles unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" contributor with an undefined affiliation. The other contributor keeps its undefined role unchanged.', async () => {
        /* */
      });
    });
    describe('when there exists a project manager with the same id', () => {
      it('it adds a new "ProjectParticipant" role with an undefined affiliation when the project manager only has an affiliation. The project manager keeps its project manager role unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" role with an undefined affiliation when the project manager only has an affiliation that is undefined. The project manager keeps its undefined project manager role unchanged.', async () => {
        /* */
      });
    });
    describe('when there exists a project manager with a different id', () => {
      it('it adds a new "ProjectParticipant" contributor with an undefined affiliation in a role to a new user when the when the project manager has an affiliation. The project manager keeps its role unchanged.', async () => {
        /* */
      });
      it('it adds a new "ProjectParticipant" contributor with an undefined affiliation in a role to a new user when the when the project manager only has an affiliation that is undefined. The project manager keeps its undefined role unchanged.', async () => {
        /* */
      });
    });
  });
});
