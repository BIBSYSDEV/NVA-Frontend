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
    it('if there is already a project manager in the contributors array it returns an error', async () => {
      /* */
    });
    it('if a project contributor with the same id already exists in the array it adds a new "ProjectManager" role with the added affiliation to the existing user', async () => {
      /* */
    });
    it('if a project contributor with the same id and affiliation already exists in the array it adds a new "ProjectManager" role with the added affiliation to the existing user', async () => {
      /* */
    });
  });
  describe('when adding a project manager without affiliation', () => {
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
    it('if there is already a project manager in the contributors array it returns an error ', async () => {
      /* */
    });
    it('if a project contributor with the same id already exists in the array it adds a new "ProjectManager" role with affiliation undefined to the existing user', async () => {
      /* */
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
    it('and there already exists a project contributor with the same id and same affiliation, it returns an error', async () => {
      /**/
    });
    it('and there already exists a project contributor with the same id and undefined affiliation, it __________', async () => {
      /**/
    });
    it('and there already exists a project contributor with the same id and other affiliation with id, it __________', async () => {
      /**/
    });
    it('and there already exists a project manager with the same id and same affiliation, it _________', async () => {
      /**/
    });
    it('and there already exists a project manager with the same id and undefined affiliation, it __________', async () => {
      /**/
    });
    it('and there already exists a project manager with the same id and other affiliation with id, it __________', async () => {
      /**/
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
    it('and there already exists a project contributor with the same id and undefined affiliation, it __________', async () => {
      /**/
    });
    it('and there already exists a project contributor with the same id and affiliation with id, it __________', async () => {
      /**/
    });
    it('and there already exists a project manager with the same id and undefined affiliation, it __________', async () => {
      /**/
    });
    it('and there already exists a project manager with the same id and affiliation with id, it __________', async () => {
      /**/
    });
  });
});
