import { describe, expect, it } from 'vitest';
import {
  addAffiliation,
  addRoles,
  AffiliationErrors,
  editAffiliation,
  isAlreadyInExistingRoles,
  removeAffiliation,
} from '../helpers/projectRoleHelpers';
import {
  abcOrgAsAffiliation,
  defOrgAsAffiliation,
  ghiOrgAsAffiliation,
  jklOrgAsAffiliation,
  localManagerRole,
  otherEmptyProjectParticipantRole,
  otherProjectParticipantRole,
  projectParticipantRole,
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
  undefinedLocalManagerRole,
  undefinedProjectParticipantRole,
} from './mockObjects';

describe('addAffiliation', () => {
  describe('to a project manager', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(addAffiliation('', [], 'ProjectManager', {})).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when they already have another project manager affiliation, it returns an error', () => {
      expect(addAffiliation('deforg', rolesWithProjectManager, 'ProjectManager', {})).toEqual({
        newContributorRoles: rolesWithProjectManager,
        error: AffiliationErrors.CAN_ONLY_BE_ONE_PROJECT_MANAGER,
      });
    });
    it('when they have no other affiliation, a new project manager role will be added', () => {
      expect(addAffiliation('deforg', [], 'ProjectManager', {})).toEqual({
        newContributorRoles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }],
      });
    });
    it('when they have an undefined project manager affiliation, a new project manager role will replace the undefined one', () => {
      expect(addAffiliation('deforg', rolesWithUndefinedProjectManager, 'ProjectManager', {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: defOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
        ],
      });
    });
    it('when they have another affiliation which is not project manager, a new project manager role will be created', () => {
      expect(addAffiliation('deforg', rolesWithoutProjectManager, 'ProjectManager', {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
          { type: 'ProjectManager', affiliation: defOrgAsAffiliation },
        ],
      });
    });
  });

  describe('to a project participant', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(addAffiliation('', [], 'ProjectParticipant', {})).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when they already have another affiliation with the same id it returns an error', () => {
      expect(addAffiliation('deforg', rolesWithDefOrg, 'ProjectParticipant', {})).toEqual({
        newContributorRoles: rolesWithDefOrg,
        error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
      });
    });
    it('when they already have another affiliation with a different id, it adds the new affiliation in an additional role', () => {
      expect(addAffiliation('abcorg', rolesWithDefOrg, 'ProjectParticipant', {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
    it('when they have no other affiliation, it adds the new affiliation in a new role', () => {
      expect(addAffiliation('abcorg', [], 'ProjectParticipant', {})).toEqual({
        newContributorRoles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
      });
    });
    it('when they have an undefined affiliation with same role type it replaces the undefined affiliation', () => {
      expect(addAffiliation('abcorg', rolesWithUndefinedProjectParticipant, 'ProjectParticipant', {})).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
    it('when they have several undefined roles it replaces the one with the same role type', () => {
      expect(addAffiliation('abcorg', severalRolesWithUndefined, 'ProjectParticipant', {})).toEqual({
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
      expect(editAffiliation('', [], 'abc', 'ProjectManager', {})).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when the affiliation to edit doesnt exist it returns an error', () => {
      expect(editAffiliation('abcorg', rolesWithProjectManagerWithGhiOrg, 'deforg', 'ProjectManager', {})).toEqual({
        newContributorRoles: rolesWithProjectManagerWithGhiOrg,
        error: AffiliationErrors.NO_ROLE_TO_CHANGE,
      });
    });
    it('when they try to change an affiliation to an affiliation that already exists on the role, it returns an error', () => {
      expect(editAffiliation('ghiorg', rolesWithProjectManagerWithGhiOrg, 'ghiorg', 'ProjectManager', {})).toEqual({
        newContributorRoles: rolesWithProjectManagerWithGhiOrg,
        error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
      });
    });
    it('when they try to change an affiliation to an affiliation that the user has on a different role type, it changes the affiliation successfully', () => {
      expect(
        editAffiliation(
          'abcorg',
          rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrg,
          'ghiorg',
          'ProjectManager',
          {}
        )
      ).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
        ],
      });
    });
    it('when they try to change an affiliation on a user with only one role, it changes the affiliation successfully', () => {
      expect(editAffiliation('abcorg', rolesWithProjectManagerWithGhiOrg, 'ghiorg', 'ProjectManager', {})).toEqual({
        newContributorRoles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }],
      });
    });
  });
  describe('for a project participant', () => {
    it('when newAffiliationId is empty it returns an error', () => {
      expect(editAffiliation('', [], 'abc', 'ProjectParticipant', {})).toEqual({
        newContributorRoles: [],
        error: AffiliationErrors.NO_AFFILIATION_ID,
      });
    });
    it('when the affiliation to edit doesnt exist it returns an error', () => {
      expect(
        editAffiliation('abcorg', rolesWithProjectParticipantWithGhiOrg, 'deforg', 'ProjectParticipant', {})
      ).toEqual({
        newContributorRoles: rolesWithProjectParticipantWithGhiOrg,
        error: AffiliationErrors.NO_ROLE_TO_CHANGE,
      });
    });
    it('when they try to change an affiliation to an affiliation that already exists on the role, it returns an error', () => {
      expect(
        editAffiliation('ghiorg', rolesWithProjectParticipantWithGhiOrg, 'ghiorg', 'ProjectParticipant', {})
      ).toEqual({
        newContributorRoles: rolesWithProjectParticipantWithGhiOrg,
        error: AffiliationErrors.ADD_DUPLICATE_AFFILIATION,
      });
    });
    it('when they try to change an affiliation to an affiliation that the user has on a different role type, it changes the affiliation successfully', () => {
      expect(
        editAffiliation(
          'ghiorg',
          rolesWithProjectManagerWithGhiOrgAndParticipantWithAbcOrg,
          'abcorg',
          'ProjectParticipant',
          {}
        )
      ).toEqual({
        newContributorRoles: [
          { type: 'ProjectManager', affiliation: ghiOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
        ],
      });
    });
    it('when they have several affiliations, it changes the correct one', () => {
      expect(
        editAffiliation('jklorg', rolesWithSeveralProjectParticipantRoles, 'deforg', 'ProjectParticipant', {})
      ).toEqual({
        newContributorRoles: [
          { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: jklOrgAsAffiliation },
          { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
        ],
      });
    });
    it('when they have only one affiliation, it changes the correct one', () => {
      expect(
        editAffiliation('abcorg', rolesWithProjectParticipantWithGhiOrg, 'ghiorg', 'ProjectParticipant', {})
      ).toEqual({
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

describe('addRoles', () => {
  it("Doesn't add roles of same role type that are empty", () => {
    expect(addRoles([projectParticipantRole], [undefinedProjectParticipantRole], 'ProjectParticipant')).toEqual([
      projectParticipantRole,
    ]);
  });
  it('Does add roles of same role type that arent empty', () => {
    expect(addRoles([projectParticipantRole], [otherProjectParticipantRole], 'ProjectParticipant')).toEqual([
      projectParticipantRole,
      otherProjectParticipantRole,
    ]);
  });
  it("Doesn't add roles that already exist in the array", () => {
    expect(addRoles([projectParticipantRole], [projectParticipantRole], 'ProjectParticipant')).toEqual([
      projectParticipantRole,
    ]);
  });
  it("Doesn't add existing undefined role of different role type", () => {
    expect(addRoles([undefinedLocalManagerRole], [undefinedLocalManagerRole], 'ProjectParticipant')).toEqual([
      undefinedLocalManagerRole,
    ]);
  });
  it("Doesn't add existing undefined role of same role type", () => {
    expect(
      addRoles([undefinedProjectParticipantRole], [otherEmptyProjectParticipantRole], 'ProjectParticipant')
    ).toEqual([undefinedProjectParticipantRole]);
  });
  it('Adds existing roles with same id if they are of different role type', () => {
    expect(addRoles([projectParticipantRole], [localManagerRole], 'ProjectParticipant')).toEqual([
      projectParticipantRole,
      localManagerRole,
    ]);
  });
});

describe('isAlreadyInExistingRoles', () => {
  it('returns true if the role is the same as a role in existing roles', () => {
    expect(isAlreadyInExistingRoles([projectParticipantRole], projectParticipantRole)).toEqual(true);
  });
  it('returns false if the role does not have same id as a role in existing roles', () => {
    expect(isAlreadyInExistingRoles([projectParticipantRole], otherProjectParticipantRole)).toEqual(false);
  });
  it('returns false if the id is the same but the role types are different', () => {
    expect(isAlreadyInExistingRoles([projectParticipantRole], localManagerRole)).toEqual(false);
  });
  it('returns true if both are undefined and has same role', () => {
    expect(isAlreadyInExistingRoles([undefinedProjectParticipantRole], undefinedProjectParticipantRole)).toEqual(true);
  });
  it('returns false if both are undefined and have different roles', () => {
    expect(isAlreadyInExistingRoles([undefinedProjectParticipantRole], undefinedLocalManagerRole)).toEqual(false);
  });
});
