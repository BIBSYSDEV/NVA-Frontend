import { describe, expect, it } from 'vitest';
import {
  addContributor,
  AddContributorErrors,
  addUnidentifiedProjectContributor,
  removeProjectManager,
  removeProjectParticipant,
} from '../helpers/projectContributorHelpers.js';
import {
  abcOrgAsAffiliation,
  contributorsArrayWithContributorsWithOnlyParticipantRole,
  contributorsArrayWithContributorWithBothPMRoleAndParticipantRole,
  contributorsArrayWithContributorWithOnlyProjectManagerRole,
  contributorsArrayWithDifferentProjectManagerWithDifferentAffiliation,
  contributorsArrayWithDifferentProjectManagerWithSameAffiliation,
  contributorsArrayWithDifferentProjectManagerWithUndefinedAffiliation,
  contributorsArrayWithExistingPersonIdentity,
  contributorsArrayWithNoProjectManager,
  contributorsArrayWithOneUnidentifiedAndOneOther,
  contributorsArrayWithOneUnidentifiedAndOneOtherWithUndefined,
  contributorsArrayWithOneUnidentifiedLocalManagerAndOneOtherWithUndefined,
  contributorsArrayWithOneUnidentifiedWithLocalManagerRoleAndOneOther,
  contributorsArrayWithOneUnidentifiedWithLocalManagerRoleAndOneOtherWithSameAffiliation,
  contributorsArrayWithOneUnidentifiedWithLocalManagerRoleWithDifferentAffiliationAndOneOtherWithSameAffiliationAsThat,
  contributorsArrayWithOneUnidentifiedWithSameAndOneOther,
  contributorsArrayWithOneUnidentifiedWithSameAndOneOtherWithUndefined,
  contributorsArrayWithOneUnidentifiedWithSameLocalManagerAndOneOther,
  contributorsArrayWithOneUnidentifiedWithSameLocalManagerAndOneOtherWithUndefined,
  contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOther,
  contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOtherWithUndefined,
  contributorsArrayWithOneUnidentifiedWithUndefinedLocalManagerAndOneOther,
  contributorsArrayWithOneUnidentifiedWithUndefinedLocalManagerAndOneOtherWithUndefined,
  contributorsArrayWithOtherPersonWithDifferentAffiliation,
  contributorsArrayWithOtherPersonWithLocalManagerAffiliation,
  contributorsArrayWithOtherPersonWithSameAffiliation,
  contributorsArrayWithOtherPersonWithUndefinedAffiliation,
  contributorsArrayWithOtherPMAndUndefinedAffiliation,
  contributorsArrayWithProjectManager,
  contributorsArrayWithSelectedPersonAsProjectManagerWithDifferentAffiliation,
  contributorsArrayWithSelectedPersonAsProjectManagerWithNoAffiliation,
  contributorsArrayWithSelectedPersonAsProjectManagerWithSameAffiliation,
  contributorsArrayWithSelectedPersonWithDifferentAffiliation,
  contributorsArrayWithSelectedPersonWithSameAffiliation,
  contributorsArrayWithSelectedPersonWithSameAffiliationAndLocalManagerRole,
  contributorsArrayWithSelectedPersonWithUndefinedAffiliation,
  contributorsArrayWithTwoUnidentified,
  contributorsArrayWithUndefinedPMAffiliationAndOtherContributor,
  contributorsArrayWithUnidentifiedAndSamePersonWithUndefined,
  contributorsArrayWithUnidentifiedContributorWithDifferentAffiliation,
  contributorsArrayWithUnidentifiedDaffy,
  contributorsArrayWithUnidentifiedDaffyAsLocalManager,
  contributorsArrayWithUnidentifiedDaffyPM,
  contributorsArrayWithUnidentifiedDaffyWithAffiliation,
  contributorsArrayWithUnidentifiedDaffyWithDefinedAffiliation,
  contributorsArrayWithUnidentifiedDaffyWithLocalManager,
  contributorsArrayWithUnidentifiedDaffyWithLocalManagerAffiliation,
  contributorsArrayWithUnidentifiedDaffyWithLocalManagerRole,
  contributorsArrayWithUnidentifiedDaffyWithLotsOfRoles,
  contributorsArrayWithUnidentifiedDaffyWithProjectManagerRole,
  contributorsArrayWithUnidentifiedDaffyWithSameAffiliation,
  contributorsArrayWithUnidentifiedDaffyWithSameLocalManagerAffiliation,
  contributorsArrayWithUnidentifiedPersonWithUndefinedAffiliationAndSelectedWithOther,
  contributorsArrayWithUnidentifiedPersonWithUndefinedAffiliationAndSelectedWithTwoOthers,
  contributorsArrayWithUnidentifiedPersonWithUnidentifiedAffiliationAndSelectedWithOther,
  contributorsArrayWithUnidentifiedProjectManagerAndOther,
  contributorsArrayWithUnidentifiedProjectManagerWithDifferentAffiliation,
  contributorsArrayWithUnidentifiedProjectManagerWithSameAffiliation,
  contributorsArrayWithUnidentifiedProjectManagerWithUndefinedAffiliation,
  contributorsArrayWithUnidentifiedProjectManagerWithUndefinedRoleAndOther,
  defOrgAsAffiliation,
  existingPersonIdentity,
  ghiOrgAsAffiliation,
  selectedPersonIdentity,
  selectedPersonWithAffiliation,
  selectedPersonWithManyAffiliations,
  selectedPersonWithoutAffiliation,
  unidentifiedDaffyIdentity,
  unidentifiedDollyIdentity,
  unidentifiedOleJensenIdentity,
} from './mockObjects';

describe('addContributor', () => {
  describe('when adding a project manager with affiliation', () => {
    it('if there is already a project manager with affiliation in the contributors array, it returns an error', () => {
      expect(
        addContributor(selectedPersonWithAffiliation, contributorsArrayWithProjectManager, 'ProjectManager')
      ).toEqual({
        error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER,
      });
    });
    it('if the person to add comes with several affiliations, it returns an error', () => {
      expect(
        addContributor(selectedPersonWithManyAffiliations, contributorsArrayWithProjectManager, 'ProjectManager')
      ).toEqual({
        error: AddContributorErrors.CAN_ONLY_ADD_ONE_PROJECT_MANAGER_ROLE,
      });
    });
    describe('when we are sent an index to add to', () => {
      it('and the index is a different index than the index of the existing project manager, it returns an error', () => {
        expect(
          addContributor(selectedPersonWithAffiliation, contributorsArrayWithTwoUnidentified, 'ProjectManager', 1)
        ).toEqual({
          error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER,
        });
      });
      it('and the provided index is too high we return an error', () => {
        expect(
          addContributor(selectedPersonWithAffiliation, contributorsArrayWithProjectManager, 'ProjectManager', 1)
        ).toEqual({
          error: AddContributorErrors.INDEX_OUT_OF_BOUNDS,
        });
      });
      it('and contributor at the index is not unidentified, it returns an error', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithUnidentifiedPersonWithUndefinedAffiliationAndSelectedWithOther,
            'ProjectManager',
            1
          )
        ).toEqual({
          error: AddContributorErrors.CAN_ONLY_REPLACE_UNIDENTIFIED_CONTRIBUTORS,
        });
      });
      it('and the unidentified contributor on the index has another Project Manager-affiliation than the one we are adding, we return an error', () => {
        expect(
          addContributor(selectedPersonWithAffiliation, contributorsArrayWithUnidentifiedDaffyPM, 'ProjectManager', 0)
        ).toEqual({
          error: AddContributorErrors.CANNOT_ADD_ANOTHER_PROJECT_MANAGER_ROLE,
        });
      });
      it('and the unidentified contributor on the index has the same Project Manager-affiliation as the one we are adding, we return an error', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithUnidentifiedProjectManagerWithSameAffiliation,
            'ProjectManager',
            0
          )
        ).toEqual({
          error: AddContributorErrors.CANNOT_ADD_ANOTHER_PROJECT_MANAGER_ROLE,
        });
      });
      describe('and the unidentified contributor on the index has an undefined Project Manager-affiliation', () => {
        it('we replace the undefined one with the selected role', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedProjectManagerWithUndefinedAffiliation,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedPersonWithUndefinedAffiliationAndSelectedWithOther,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                  { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the roles selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedAndSamePersonWithUndefined,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
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
      it('if we send an index to replace the participant with a different id, and the index already has a project manager role, we return an error', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithUnidentifiedProjectManagerAndOther,
            'ProjectManager',
            0
          )
        ).toEqual({
          error: AddContributorErrors.CANNOT_ADD_ANOTHER_PROJECT_MANAGER_ROLE,
        });
      });
      it('if we send an index to replace the participant with a different id, we replace the person on the index with the selected person, and replace the undefined affiliation with the selected one', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithUnidentifiedProjectManagerWithUndefinedRoleAndOther,
            'ProjectManager',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                { type: 'ProjectManager', affiliation: abcOrgAsAffiliation },
              ],
            },
          ],
        });
      });
    });
    it('when there are no other contributors, the chosen person is added with role type "ProjectManager" and the added affiliation', () => {
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
  describe('when adding a project manager without affiliation', () => {
    it('if there is already a project manager in the contributors array it returns an error', () => {
      expect(
        addContributor(selectedPersonWithoutAffiliation, contributorsArrayWithProjectManager, 'ProjectManager')
      ).toEqual({
        error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER,
      });
    });
    describe('when we are sent an index to add to', () => {
      describe('and the unidentified contributor on the index has a Project Manager-affiliation', () => {
        it('we change the user and keep the role', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedProjectManagerWithDifferentAffiliation,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectManager', affiliation: defOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, and the roles of the replaced index', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedPersonWithUnidentifiedAffiliationAndSelectedWithOther,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                  { type: 'ProjectManager', affiliation: undefined },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the new user and empty affiliations', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedAndSamePersonWithUndefined,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'ProjectManager', affiliation: undefined },
                ],
              },
            ],
          });
        });
      });
      describe('and the unidentified contributor on the index has an undefined Project Manager-affiliation', () => {
        it('we replace the user and keep the undefined role', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedProjectManagerWithUndefinedAffiliation,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              { identity: selectedPersonIdentity, roles: [{ type: 'ProjectManager', affiliation: undefined }] },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, and an empty PM affiliation', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedPersonWithUndefinedAffiliationAndSelectedWithTwoOthers,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'ProjectManager', affiliation: undefined },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the empty role on the index', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedAndSamePersonWithUndefined,
              'ProjectManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'ProjectManager', affiliation: undefined },
                ],
              },
            ],
          });
        });
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
      it('when the other contributor only has an affiliation that is undefined, it adds a new "ProjectManager" contributor with with an empty affiliation', () => {
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
    it('when there are no other contributors, the chosen person is added with role "ProjectManager" and affiliation undefined', () => {
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
  describe('when adding a local manager with affiliation', () => {
    it('the chosen person is added with role "LocalManager" and affiliation with id', () => {
      expect(addContributor(selectedPersonWithAffiliation, [], 'LocalManager')).toEqual({
        newContributors: [
          {
            identity: selectedPersonIdentity,
            roles: [
              {
                type: 'LocalManager',
                affiliation: abcOrgAsAffiliation,
              },
            ],
          },
        ],
      });
    });
    describe('if we are sent an index to add to', () => {
      it("and the participant on the index isn't unidentified, we return an error", () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithLocalManagerAffiliation,
            'LocalManager',
            0
          )
        ).toEqual({
          error: AddContributorErrors.CAN_ONLY_REPLACE_UNIDENTIFIED_CONTRIBUTORS,
        });
      });
      it("and the participant on the index doesn't have a role with the same role type as the roleToAddTo, we return an error", () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithUnidentifiedContributorWithDifferentAffiliation,
            'LocalManager',
            0
          )
        ).toEqual({
          error: AddContributorErrors.MUST_HAVE_ROLE_OF_TYPE_TO_BE_IDENTIFIED,
        });
      });
      describe('and the unidentified contributor on the index has another affiliation', () => {
        it('we keep the existing affiliation and add an extra', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithLocalManagerAffiliation,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'LocalManager', affiliation: defOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, the roles of the replaced index, and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithLocalManagerRoleAndOneOther,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: defOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with the same affiliation on a different role, the index will now contain the roles of the existing person, the roles of the replaced index, and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithLocalManagerRoleAndOneOtherWithSameAffiliation,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: defOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with a different role, and the index we are replacing has the same affiliation as the existing user, the index will now contain the roles of the existing person, the roles of the replaced index, and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithLocalManagerRoleWithDifferentAffiliationAndOneOtherWithSameAffiliationAsThat,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: defOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the roles of the replaced index and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedLocalManagerAndOneOtherWithUndefined,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'LocalManager', affiliation: defOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
      });
      describe('and the unidentified contributor on the index has the same affiliation', () => {
        it('we only keep one of the affiliations', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithSameLocalManagerAffiliation,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'LocalManager', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, and the roles of the replaced index', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithSameLocalManagerAndOneOther,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the undefined affiliation from the other role, and the affiliation selected when adding and the role from the index', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithSameLocalManagerAndOneOtherWithUndefined,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
      });
      describe('and the unidentified contributor on the index has an undefined affiliation', () => {
        it('we replace the undefined one', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithLocalManagerRole,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'LocalManager', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedLocalManagerAndOneOther,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the unidentified affiliation of the other role, and the roles selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedLocalManagerAndOneOtherWithUndefined,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
      });
    });
    describe('when there exists a project contributor with the same id', () => {
      it('when the existing contributor has an affiliation with the same id and the same role, it returns an error', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithSameAffiliationAndLocalManagerRole,
            'LocalManager'
          )
        ).toEqual({
          error: AddContributorErrors.SAME_ROLE_WITH_SAME_AFFILIATION,
        });
      });
      it('when the existing contributor has an affiliation with the same id, but not the same role, it adds a new LocalManager role to the existing person', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithSameAffiliation,
            'LocalManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
              ],
            },
          ],
        });
      });
      it('when the existing contributor only has an affiliation with a different id, it adds a new "LocalManager" role with the added affiliation to the existing user.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonWithDifferentAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
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
            'LocalManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                { type: 'ProjectParticipant', affiliation: undefined },
                { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project contributor with a different id', () => {
      it('when the other contributor has an affiliation with the same id, it adds a new "LocalManager" contributor with the added affiliation in a role to a new user. The other project participant keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithSameAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the other contributor only has an affiliation with a different id, it adds a new "LocalManager" contributor with the added affiliation in a role. The other contributor keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithDifferentAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the other contributor only has an affiliation that is undefined, it adds a new "LocalManager" contributor with the added affiliation in a role to a new user. The other contributor keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithUndefinedAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with the same id', () => {
      it('when the project manager has an affiliation with the same id, it adds a new "LocalManager" role with the added affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithSameAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation with a different id, it adds a new "LocalManager" role with the added affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithDifferentAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation that is undefined it adds a new "LocalManager" role with the added affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithNoAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with a different id', () => {
      it('when the project manager has an affiliation with the same id, it adds a new "LocalManager" contributor with the added affiliation in a role to a new user. The the project manager keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithDifferentProjectManagerWithSameAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation with a different id, it adds a new "LocalManager" contributor with the added affiliation in a role. The project manager keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithDifferentProjectManagerWithDifferentAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when the when the project manager only has an affiliation that is undefined, it adds a new "LocalManager" contributor with the added affiliation in a role. The project manager keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithDifferentProjectManagerWithUndefinedAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
    });
  });
  describe('when adding a local manager without affiliation', () => {
    it('the chosen person is added with role with type LocalManager and affiliation undefined', () => {
      expect(addContributor(selectedPersonWithoutAffiliation, [], 'LocalManager')).toEqual({
        newContributors: [
          {
            identity: selectedPersonIdentity,
            roles: [
              {
                type: 'LocalManager',
                affiliation: undefined,
              },
            ],
          },
        ],
      });
    });
    describe('when we are sent an index to add to', () => {
      describe('and the unidentified contributor on the index has another affiliation', () => {
        it('we replace the user and keep the affiliation', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithLocalManagerAffiliation,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'LocalManager', affiliation: defOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person and the roles of the replaced index', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedWithLocalManagerRoleAndOneOther,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: defOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the roles of the replaced index', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedWithSameLocalManagerAndOneOtherWithUndefined,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'LocalManager', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
      });
      describe('and the unidentified contributor on the index has an undefined affiliation', () => {
        it('we replace the undefined contributor and keep the undefined role', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithLocalManagerRole,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'LocalManager', affiliation: undefined }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedLocalManagerAndOneOther,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'LocalManager', affiliation: undefined },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the the new user with an empty role', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedLocalManagerAndOneOtherWithUndefined,
              'LocalManager',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: undefined },
                  { type: 'LocalManager', affiliation: undefined },
                ],
              },
            ],
          });
        });
      });
    });
    describe('when there exists a project contributor with the same id', () => {
      it('when there is an existing contributor with the same id and same role, it does nothing.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonWithSameAffiliationAndLocalManagerRole,
            'LocalManager'
          )
        ).toEqual({
          newContributors: [
            {
              identity: selectedPersonIdentity,
              roles: [
                {
                  type: 'LocalManager',
                  affiliation: abcOrgAsAffiliation,
                },
              ],
            },
          ],
        });
      });
      it('when there is an existing contributor with the same id and different role, it adds a new undefined LocalManager-role to the existing user.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonWithSameAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project contributor with a different id', () => {
      it('it adds a new "LocalManager" contributor with an undefined affiliation. The other contributor keeps its roles unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithOtherPersonWithUndefinedAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with the same id', () => {
      it('when the project manager only has an other affiliation, it adds a new "LocalManager" role with an undefined affiliation. The project manager keeps its project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithDifferentAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation that is undefined, it adds a new "LocalManager" role with an undefined affiliation. The project manager keeps its undefined project manager role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithSelectedPersonAsProjectManagerWithNoAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
    });
    describe('when there exists a project manager with a different id', () => {
      it('when the when the project manager has an affiliation, it adds a new "LocalManager" contributor with an undefined affiliation. The project manager keeps its role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithDifferentProjectManagerWithDifferentAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
                  affiliation: undefined,
                },
              ],
            },
          ],
        });
      });
      it('when the project manager only has an affiliation that is undefined, it adds a new "LocalManager" contributor with an undefined affiliation. The project manager keeps its undefined role unchanged.', () => {
        expect(
          addContributor(
            selectedPersonWithoutAffiliation,
            contributorsArrayWithDifferentProjectManagerWithUndefinedAffiliation,
            'LocalManager'
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
                  type: 'LocalManager',
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
    describe('if we are sent an index to add to', () => {
      it('and the participant on the index isnt unidentified, we return an error', () => {
        expect(
          addContributor(
            selectedPersonWithAffiliation,
            contributorsArrayWithOtherPersonWithDifferentAffiliation,
            'ProjectParticipant',
            0
          )
        ).toEqual({
          error: AddContributorErrors.CAN_ONLY_REPLACE_UNIDENTIFIED_CONTRIBUTORS,
        });
      });
      describe('and the unidentified contributor on the index has another affiliation', () => {
        it('we keep the existing affiliation and add an extra', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithAffiliation,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, the roles of the replaced index, and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedAndOneOther,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the roles of the replaced index and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedAndOneOtherWithUndefined,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
      });
      describe('and the unidentified contributor on the index has the same affiliation', () => {
        it('we only keep one of the affiliations', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithSameAffiliation,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, and the roles of the replaced index', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithSameAndOneOther,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the affiliation selected when adding and the role from the index', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithSameAndOneOtherWithUndefined,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
      });
      describe('and the unidentified contributor on the index has an undefined affiliation', () => {
        it('we replace the undefined one', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithUnidentifiedDaffy,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person, and the affiliation selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOther,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the roles selected when adding', () => {
          expect(
            addContributor(
              selectedPersonWithAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOtherWithUndefined,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
      });
    });
    describe('when there exists a project contributor with the same id', () => {
      it('when the existing contributor has an affiliation with the same id, it returns an error', () => {
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
    describe('when we are sent an index to add to', () => {
      describe('and the unidentified contributor on the index has another affiliation', () => {
        it('we replace the user and keep the affiliation', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedDaffyWithAffiliation,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: defOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person and the roles of the replaced index', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedAndOneOther,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  { type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation },
                  { type: 'ProjectParticipant', affiliation: defOrgAsAffiliation },
                ],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the roles of the replaced index', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedWithSameAndOneOtherWithUndefined,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
              },
            ],
          });
        });
      });
      describe('and the unidentified contributor on the index has an undefined affiliation', () => {
        it('we replace the undefined one and keep an undefined role', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithUnidentifiedDaffy,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index with affiliations, the index will now contain the roles of the existing person', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOther,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [{ type: 'ProjectParticipant', affiliation: ghiOrgAsAffiliation }],
              },
            ],
          });
        });
        it('and the contributor we are adding exists on a different index without affiliations, the index will now contain the the new user with an empty role', () => {
          expect(
            addContributor(
              selectedPersonWithoutAffiliation,
              contributorsArrayWithOneUnidentifiedWithUndefinedAndOneOtherWithUndefined,
              'ProjectParticipant',
              0
            )
          ).toEqual({
            newContributors: [
              { identity: selectedPersonIdentity, roles: [{ type: 'ProjectParticipant', affiliation: undefined }] },
            ],
          });
        });
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
    expect(removeProjectManager(contributorsArrayWithContributorWithOnlyProjectManagerRole)).toEqual([
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

describe('addUnidentifiedProjectContributor', () => {
  it('when there is no search term it returns an error', () => {
    expect(addUnidentifiedProjectContributor('', [], 'ProjectParticipant')).toEqual({
      error: AddContributorErrors.NO_SEARCH_TERM,
    });
  });
  describe('when adding a new unidentified contributor', () => {
    it('when the search term consists of one word, it makes a new contributor with only first name', () => {
      expect(
        addUnidentifiedProjectContributor('DaffyDuck', contributorsArrayWithExistingPersonIdentity, 'ProjectManager')
      ).toEqual({
        newContributors: [
          {
            identity: existingPersonIdentity,
            roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
          },
          {
            identity: {
              firstName: 'DaffyDuck',
              lastName: '',
              type: 'Person',
            },
            roles: [{ type: 'ProjectManager', affiliation: undefined }],
          },
        ],
      });
    });
    it('when the search term consists of three words, it saves the last word as the lastName and all the others as the first name', () => {
      expect(
        addUnidentifiedProjectContributor(
          'Daffy Augustus Duck',
          contributorsArrayWithExistingPersonIdentity,
          'ProjectManager'
        )
      ).toEqual({
        newContributors: [
          {
            identity: existingPersonIdentity,
            roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
          },
          {
            identity: {
              firstName: 'Daffy Augustus',
              lastName: 'Duck',
              type: 'Person',
            },
            roles: [{ type: 'ProjectManager', affiliation: undefined }],
          },
        ],
      });
    });
    describe('when adding an unidentified project manager', () => {
      it('if there already is a contributor with a project manager-role, it returns an error', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Daffy Duck',
            contributorsArrayWithContributorWithBothPMRoleAndParticipantRole,
            'ProjectManager'
          )
        ).toEqual({ error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER });
      });
      it('when there is another unidentified contributor with an different role and the same name, it adds a new unidentified ProjectManager', () => {
        expect(
          addUnidentifiedProjectContributor('Daffy Duck', contributorsArrayWithUnidentifiedDaffy, 'ProjectManager')
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectManager', affiliation: undefined }],
            },
          ],
        });
      });
      it('when there is another identified contributor with a different role, it adds a new unidentified ProjectManager', () => {
        expect(
          addUnidentifiedProjectContributor('Ole Jensen', contributorsArrayWithExistingPersonIdentity, 'ProjectManager')
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
            },
            {
              identity: unidentifiedOleJensenIdentity,
              roles: [{ type: 'ProjectManager', affiliation: undefined }],
            },
          ],
        });
      });
    });
    describe('when adding an unidentified project participant', () => {
      it('it returns a new identity without id, with a role with unidentified project participant', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Daffy Duck',
            contributorsArrayWithContributorWithOnlyProjectManagerRole,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
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
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
          ],
        });
      });
      it('when there is another unidentified contributor with the same name, it adds a new contributor', () => {
        expect(
          addUnidentifiedProjectContributor('Daffy Duck', contributorsArrayWithUnidentifiedDaffy, 'ProjectParticipant')
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
          ],
        });
      });
      it('when there is another unidentified contributor with a different name, it it adds a new contributor', () => {
        expect(
          addUnidentifiedProjectContributor('Mikkel Rev', contributorsArrayWithUnidentifiedDaffy, 'ProjectParticipant')
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
            {
              identity: {
                firstName: 'Mikkel',
                lastName: 'Rev',
                type: 'Person',
              },
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
          ],
        });
      });
      it('when there is another identified contributor with the same name, it', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Ole Jensen',
            contributorsArrayWithExistingPersonIdentity,
            'ProjectParticipant'
          )
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
            },
            {
              identity: unidentifiedOleJensenIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
          ],
        });
      });
    });
    describe('when adding an unidentified local manager', () => {
      it('it returns a new identity without id, with a role with unidentified local manager', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Daffy Duck',
            contributorsArrayWithContributorWithOnlyProjectManagerRole,
            'LocalManager'
          )
        ).toEqual({
          newContributors: [
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
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'LocalManager', affiliation: undefined }],
            },
          ],
        });
      });
      it('when there is another unidentified contributor with the same name, it adds a new contributor', () => {
        expect(
          addUnidentifiedProjectContributor('Daffy Duck', contributorsArrayWithUnidentifiedDaffy, 'LocalManager')
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'LocalManager', affiliation: undefined }],
            },
          ],
        });
      });
      it('when there is another unidentified contributor with a different name, it it adds a new contributor', () => {
        expect(
          addUnidentifiedProjectContributor('Mikkel Rev', contributorsArrayWithUnidentifiedDaffy, 'LocalManager')
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDaffyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
            {
              identity: {
                firstName: 'Mikkel',
                lastName: 'Rev',
                type: 'Person',
              },
              roles: [{ type: 'LocalManager', affiliation: undefined }],
            },
          ],
        });
      });
      it('when there is another identified contributor with the same name, it', () => {
        expect(
          addUnidentifiedProjectContributor('Ole Jensen', contributorsArrayWithExistingPersonIdentity, 'LocalManager')
        ).toEqual({
          newContributors: [
            {
              identity: existingPersonIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation }],
            },
            {
              identity: unidentifiedOleJensenIdentity,
              roles: [{ type: 'LocalManager', affiliation: undefined }],
            },
          ],
        });
      });
    });
  });
  describe('when replacing an unidentified contributor with a new unidentified contributor', () => {
    it("if the contributor we are replacing isn't unidentified, we return an error (this in ensured in the UI)", () => {
      expect(
        addUnidentifiedProjectContributor('Dolly Duck', contributorsArrayWithProjectManager, 'ProjectManager', 0)
      ).toEqual({ error: AddContributorErrors.CAN_ONLY_REPLACE_UNIDENTIFIED_CONTRIBUTORS });
    });
    it('and the provided index is too high we return an error (this in ensured in the UI)', () => {
      expect(
        addUnidentifiedProjectContributor('Dolly Duck', contributorsArrayWithProjectManager, 'ProjectManager', 1)
      ).toEqual({ error: AddContributorErrors.INDEX_OUT_OF_BOUNDS });
    });
    describe('when adding an unidentified project manager', () => {
      it('keeps all the roles of the project manager its replacing', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Dolly Duck',
            contributorsArrayWithUnidentifiedDaffyWithProjectManagerRole,
            'ProjectManager',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDollyIdentity,
              roles: [{ type: 'ProjectManager', affiliation: undefined }],
            },
          ],
        });
      });
      it('keeps all the roles of the project manager its replacing, also the ones with different role types', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Dolly Duck',
            contributorsArrayWithUnidentifiedDaffyWithLotsOfRoles,
            'ProjectManager',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDollyIdentity,
              roles: [
                { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                { type: 'LocalManager', affiliation: defOrgAsAffiliation },
                { type: 'ProjectManager', affiliation: undefined },
              ],
            },
          ],
        });
      });
      it('keeps all the roles of the project manager its replacing, also if it is not undefined', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Dolly Duck',
            contributorsArrayWithUnidentifiedDaffyWithDefinedAffiliation,
            'ProjectManager',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDollyIdentity,
              roles: [{ type: 'ProjectManager', affiliation: abcOrgAsAffiliation }],
            },
          ],
        });
      });
    });
    describe('when adding an unidentified project participant', () => {
      it('when sending an index, the person on the index in the array is changed', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Ole Jensen',
            contributorsArrayWithUnidentifiedDaffy,
            'ProjectParticipant',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedOleJensenIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
          ],
        });
      });
      it('keeps all the roles of the project participant its replacing', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Dolly Duck',
            contributorsArrayWithUnidentifiedDaffy,
            'ProjectParticipant',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDollyIdentity,
              roles: [{ type: 'ProjectParticipant', affiliation: undefined }],
            },
          ],
        });
      });
      it('keeps all the roles of the project participant its replacing, also the ones with different role types', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Dolly Duck',
            contributorsArrayWithUnidentifiedDaffyWithLotsOfRoles,
            'ProjectParticipant',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDollyIdentity,
              roles: [
                { type: 'ProjectManager', affiliation: undefined },
                { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                { type: 'LocalManager', affiliation: defOrgAsAffiliation },
              ],
            },
          ],
        });
      });
    });
    describe('when adding an unidentified local manager', () => {
      it('when sending an index, the person on the index in the array is changed', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Ole Jensen',
            contributorsArrayWithUnidentifiedDaffyAsLocalManager,
            'LocalManager',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedOleJensenIdentity,
              roles: [{ type: 'LocalManager', affiliation: undefined }],
            },
          ],
        });
      });
      it('keeps all the roles of the local manager its replacing', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Dolly Duck',
            contributorsArrayWithUnidentifiedDaffyWithLocalManager,
            'LocalManager',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDollyIdentity,
              roles: [{ type: 'LocalManager', affiliation: undefined }],
            },
          ],
        });
      });
      it('keeps all the roles of the local manager its replacing, also the ones with different role types', () => {
        expect(
          addUnidentifiedProjectContributor(
            'Dolly Duck',
            contributorsArrayWithUnidentifiedDaffyWithLotsOfRoles,
            'LocalManager',
            0
          )
        ).toEqual({
          newContributors: [
            {
              identity: unidentifiedDollyIdentity,
              roles: [
                { type: 'ProjectManager', affiliation: undefined },
                { type: 'ProjectParticipant', affiliation: abcOrgAsAffiliation },
                { type: 'LocalManager', affiliation: defOrgAsAffiliation },
              ],
            },
          ],
        });
      });
    });
  });
});
