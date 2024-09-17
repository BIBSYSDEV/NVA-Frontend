import { describe, expect, it } from 'vitest';
import { addAffiliation, AffiliationErrors, editAffiliation, removeAffiliation } from '../helpers/projectRoleHelpers';
import {
  abcOrgAsAffiliation,
  defOrgAsAffiliation,
  ghiOrgAsAffiliation,
  jklOrgAsAffiliation,
  rolesWithDefOrg,
  rolesWithoutProjectManager,
  rolesWithProjectManager,
  rolesWithProjectManagerWithGhiOrg,
  rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrg,
  rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrgReversed,
  rolesWithProjectParticipantWithGhiOrg,
  rolesWithSeveralProjectParticipantRoles,
  rolesWithUndefinedProjectManager,
  rolesWithUndefinedProjectParticipant,
  severalRolesWithUndefined,
} from './mockObjects';

describe('addAffiliation', () => {
  describe('to a project manager', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(addAffiliation('', [], true, {})).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when they already have another project manager affiliation, it returns an error', () => {
      expect(addAffiliation('deforg', rolesWithProjectManager, true, {})).toEqual({
        newContributorRoles: rolesWithProjectManager,
        error: AffiliationErrors.CAN_ONLY_BE_ONE_PROJECT_MANAGER,
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
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when they already have another affiliation with the same id it returns an error', () => {
      expect(addAffiliation('deforg', rolesWithDefOrg, false, {})).toEqual({
        newContributorRoles: rolesWithDefOrg,
        error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
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

describe('editAffiliation', () => {
  describe('for a project manager', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(editAffiliation('', [], 'abc', true, {})).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when the affiliation to edit doesnt exist it returns an error', () => {
      expect(editAffiliation('abcorg', rolesWithProjectManagerWithGhiOrg, 'deforg', true, {})).toEqual({
        newContributorRoles: rolesWithProjectManagerWithGhiOrg,
        error: AffiliationErrors.NO_ROLE_TO_CHANGE,
      });
    });
    it('when they try to change an affiliation to an affiliation that already exists on the role, it returns an error', () => {
      expect(editAffiliation('ghiorg', rolesWithProjectManagerWithGhiOrg, 'ghiorg', true, {})).toEqual({
        newContributorRoles: rolesWithProjectManagerWithGhiOrg,
        error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
      });
    });
    it('when they try to change an affiliation to an affiliation that the user has on a different role type, it changes the affiliation successfully', () => {
      expect(
        editAffiliation('abcorg', rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrg, 'ghiorg', true, {})
      ).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
    it('when they try to change an affiliation on a user with only one role, it changes the affiliation successfully', () => {
      expect(editAffiliation('abcorg', rolesWithProjectManagerWithGhiOrg, 'ghiorg', true, {})).toEqual({
        newContributorRoles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }],
      });
    });
  });
  describe('for a project participant', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(editAffiliation('', [], 'abc', false, {})).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when the affiliation to edit doesnt exist it returns an error', () => {
      expect(editAffiliation('abcorg', rolesWithProjectParticipantWithGhiOrg, 'deforg', false, {})).toEqual({
        newContributorRoles: rolesWithProjectParticipantWithGhiOrg,
        error: AffiliationErrors.NO_ROLE_TO_CHANGE,
      });
    });
    it('when they try to change an affiliation to an affiliation that already exists on the role, it returns an error', () => {
      expect(editAffiliation('ghiorg', rolesWithProjectParticipantWithGhiOrg, 'ghiorg', false, {})).toEqual({
        newContributorRoles: rolesWithProjectParticipantWithGhiOrg,
        error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
      });
    });
    it('when they try to change an affiliation to an affiliation that the user has on a different role type, it changes the affiliation successfully', () => {
      expect(
        editAffiliation('ghiorg', rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrg, 'abcorg', false, {})
      ).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: ghiOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
        ],
      });
    });
    it('when they have several affiliations, it changes the correct one', () => {
      expect(editAffiliation('jklorg', rolesWithSeveralProjectParticipantRoles, 'deforg', false, {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: jklOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
        ],
      });
    });
    it('when they have only one affiliation, it changes the correct one', () => {
      expect(editAffiliation('abcorg', rolesWithProjectParticipantWithGhiOrg, 'ghiorg', false, {})).toEqual({
        newContributorRoles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
      });
    });
  });
});

describe('removeAffiliation', () => {
  describe('for a project manager', () => {
    it('if we dont have an affiliationId it returns an error', () => {
      expect(removeAffiliation('', [], true)).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('if the role to delete doesnt exist it returns an error', () => {
      expect(removeAffiliation('abcorg', rolesWithProjectManagerWithGhiOrg, true)).toEqual({
        newContributorRoles: rolesWithProjectManagerWithGhiOrg,
        error: AffiliationErrors.NO_ROLE_TO_REMOVE,
      });
    });
    it('when they have only one affiliation on the role type, it changes the affiliation to undefined', () => {
      expect(removeAffiliation('ghiorg', rolesWithProjectManagerWithGhiOrg, true)).toEqual({
        newContributorRoles: [{ type: 'ProjectManager', affiliation: undefined }],
      });
    });
    it('when they have more than one affiliation, it deletes the correct one', () => {
      expect(removeAffiliation('ghiorg', rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrg, true)).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: undefined },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
    it('when they have more than one affiliation, it deletes the correct one also when its not first in the array', () => {
      expect(
        removeAffiliation('ghiorg', rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrgReversed, true)
      ).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectManager', affiliation: undefined },
        ],
      });
    });
  });
  describe('for a project participant', () => {
    it('if we dont have an affiliationId it returns an error', () => {
      expect(removeAffiliation('', [], false)).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('if the role to delete doesnt exist it returns an error', () => {
      expect(removeAffiliation('abcorg', rolesWithProjectParticipantWithGhiOrg, false)).toEqual({
        newContributorRoles: rolesWithProjectParticipantWithGhiOrg,
        error: AffiliationErrors.NO_ROLE_TO_REMOVE,
      });
    });
    it('when they have only one affiliation on the role type, it changes the affiliation to undefined', () => {
      expect(removeAffiliation('ghiorg', rolesWithProjectParticipantWithGhiOrg, false)).toEqual({
        newContributorRoles: [{ type: 'ProjectParticipant', affiliation: undefined }],
      });
    });
    it('when they have more than one affiliation, it deletes the correct one', () => {
      expect(removeAffiliation('deforg', rolesWithSeveralProjectParticipantRoles, false)).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
        ],
      });
    });
  });
});
