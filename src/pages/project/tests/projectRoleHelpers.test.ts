import { describe, expect, it } from 'vitest';
import { addAffiliation, AddAffiliationErrors } from '../helpers/projectRoleHelpers';
import {
  abcOrgAsAffiliation,
  defOrgAsAffiliation,
  rolesWithDefOrg,
  rolesWithoutProjectManager,
  rolesWithProjectManager,
  rolesWithUndefinedProjectManager,
  rolesWithUndefinedProjectParticipant,
  severalRolesWithUndefined,
} from './mockObjects';

describe('addAffiliation', () => {
  describe('to a project manager', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(addAffiliation('', [], true, {})).toEqual({
        newContributorRoles: [],
        error: AddAffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when they already have another project manager affiliation, it returns an error', () => {
      expect(addAffiliation('deforg', rolesWithProjectManager, true, {})).toEqual({
        newContributorRoles: rolesWithProjectManager,
        error: AddAffiliationErrors.CAN_ONLY_BE_ONE_PROJECT_MANAGER,
      });
    });
    it('when they have no other affiliation, a new project manager role will be added', () => {
      expect(addAffiliation('deforg', [], true, {})).toEqual({
        newContributorRoles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }],
      });
    });
    it('when they have an undefined project manager affiliation, a new project manager role will replace the undefined one', () => {
      expect(addAffiliation('deforg', rolesWithUndefinedProjectManager, true, {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: defOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      });
    });
    it('when they have another affiliation which is not project manager, a new project manager role will be created', () => {
      expect(addAffiliation('deforg', rolesWithoutProjectManager, true, {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
          { type: 'ProjectManager', affiliation: defOrgAsAffiliation },
        ],
      });
    });
  });

  describe('to a project participant', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(addAffiliation('', [], false, {})).toEqual({
        newContributorRoles: [],
        error: AddAffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when they already have another affiliation with the same id it returns an error', () => {
      expect(addAffiliation('deforg', rolesWithDefOrg, false, {})).toEqual({
        newContributorRoles: rolesWithDefOrg,
        error: AddAffiliationErrors.ADD_DUPLICATE_AFFILIATION,
      });
    });
    it('when they already have another affiliation with a different id, it adds the new affiliation in an additional role', () => {
      expect(addAffiliation('abcorg', rolesWithDefOrg, false, {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
    it('when they have no other affiliation, it adds the new affiliation in a new role', () => {
      expect(addAffiliation('abcorg', [], false, {})).toEqual({
        newContributorRoles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
      });
    });
    it('when they have an undefined affiliation with same role type it replaces the undefined affiliation', () => {
      expect(addAffiliation('abcorg', rolesWithUndefinedProjectParticipant, false, {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
    it('when they have several undefined roles it replaces the one with the same role type', () => {
      expect(addAffiliation('abcorg', severalRolesWithUndefined, false, {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: undefined },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
  });
});
