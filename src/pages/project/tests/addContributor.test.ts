import { describe, expect, it } from 'vitest';
import {
  ProjectContributor,
  ProjectContributorIdentity,
  ProjectContributorType,
  ProjectOrganization,
} from '../../../types/project.types';
import { addContributor, AddContributorErrors } from '../helpers/projectContributorHelpers';
import {
  abcOrgAsAffiliation,
  contributorsArrayWithProjectManager,
  contributorsArrayWithProjectManagerWithoutAffiliation,
  defOrgAsAffiliation,
  existingPersonIdentity,
  ghiOrgAsAffiliation,
  selectedPersonIdentity,
  selectedPersonWithAffiliation,
  selectedPersonWithManyAffiliations,
  selectedPersonWithoutAffiliation,
} from './mockObjects';

type AffiliationState = 'same' | 'other' | 'no';
const contributorTypes: ProjectContributorType[] = ['ProjectManager', 'LocalManager', 'ProjectParticipant'];
const affiliationStates: AffiliationState[] = ['same', 'other', 'no'];
const boolean = [true, false];

export const createArrayWithOnePerson = (
  identity: ProjectContributorIdentity,
  role: ProjectContributorType,
  roleAffiliation: ProjectOrganization | undefined
) => {
  return [{ identity: identity, roles: [{ type: role, affiliation: roleAffiliation }] }] as ProjectContributor[];
};

const sameOtherOrNoAffiliation = (addWithAffiliation: boolean, affiliationState: AffiliationState) => {
  if (addWithAffiliation) {
    if (affiliationState === 'same') return 'the same affiliation as we are adding';
    if (affiliationState === 'other') return 'another affiliation than the one we are adding';
    if (affiliationState === 'no') return 'no affiliation';
  } else {
    if (affiliationState === 'other') return 'an affiliation';
    if (affiliationState === 'no') return 'no affiliation';
  }
};

const whatItDoes = (
  role: ProjectContributorType,
  otherRole: ProjectContributorType,
  existingAffiliationState: AffiliationState,
  addWithAffiliation: boolean,
  existingContributorHasSameId: boolean
) => {
  const addsANewRoleString: string = `adds a new ${role}-role ${addWithAffiliation ? 'with the added affiliation' : 'with affiliation undefined'} to ${existingContributorHasSameId ? 'the existing contributor' : 'a new user'}`;
  const existingKeepsItsRoleString: string = `${existingAffiliationState !== 'no' ? `The existing contributor keeps its ${otherRole}-role.` : ''}`;

  if (role !== otherRole) {
    return `${addsANewRoleString}. ${existingKeepsItsRoleString}`;
  } else {
    if (existingAffiliationState === 'same') {
      if (existingContributorHasSameId) return 'returns an error';
      else return addsANewRoleString;
    } else if (existingAffiliationState === 'other') {
      if (existingContributorHasSameId) {
        if (addWithAffiliation) return 'adds the new affiliation to the existing contributor';
        else return 'does nothing';
      } else return 'adds the new affiliation to a new user';
    } else if (existingAffiliationState === 'no') {
      if (existingContributorHasSameId) {
        if (addWithAffiliation) return addsANewRoleString;
        else return 'does nothing';
      } else return addsANewRoleString;
    }
  }
};

const getCorrectContributorsArrayOutput = (
  role: ProjectContributorType,
  otherRole: ProjectContributorType,
  affiliationState: AffiliationState,
  addWithAffiliation: boolean,
  existingContributorHasSameId: boolean
) => {
  const existingContributorRole = {
    type: otherRole,
    affiliation:
      affiliationState === 'same'
        ? abcOrgAsAffiliation
        : affiliationState === 'other'
          ? defOrgAsAffiliation
          : undefined,
  };

  let contributors: ProjectContributor[] = [
    {
      identity: existingContributorHasSameId ? selectedPersonIdentity : existingPersonIdentity,
      roles: [existingContributorRole],
    },
  ];

  const addRoleObject = {
    type: role,
    affiliation: addWithAffiliation ? abcOrgAsAffiliation : undefined,
  };

  if (role !== otherRole) {
    if (existingContributorHasSameId) {
      contributors = [{ identity: selectedPersonIdentity, roles: [existingContributorRole, addRoleObject] }];
    } else {
      contributors = [
        { identity: existingPersonIdentity, roles: [existingContributorRole] },
        { identity: selectedPersonIdentity, roles: [addRoleObject] },
      ];
    }
  } else {
    if (affiliationState === 'same') {
      if (existingContributorHasSameId) return { error: AddContributorErrors.SAME_ROLE_WITH_SAME_AFFILIATION };
      else
        contributors = [
          { identity: existingPersonIdentity, roles: [existingContributorRole] },
          { identity: selectedPersonIdentity, roles: [addRoleObject] },
        ];
    } else if (affiliationState === 'other') {
      if (existingContributorHasSameId) {
        if (addWithAffiliation)
          contributors = [{ identity: selectedPersonIdentity, roles: [existingContributorRole, addRoleObject] }];
      } else
        contributors = [
          { identity: existingPersonIdentity, roles: [existingContributorRole] },
          { identity: selectedPersonIdentity, roles: [addRoleObject] },
        ];
    } else if (affiliationState === 'no') {
      if (existingContributorHasSameId) {
        if (addWithAffiliation) contributors = [{ identity: selectedPersonIdentity, roles: [addRoleObject] }];
      } else
        contributors = [
          { identity: existingPersonIdentity, roles: [existingContributorRole] },
          { identity: selectedPersonIdentity, roles: [addRoleObject] },
        ];
    }
  }

  return { newContributors: contributors };
};

describe('addContributor', () => {
  contributorTypes.forEach((role) => {
    boolean.forEach((addWithAffiliation) => {
      describe(`When adding a ${role} ${addWithAffiliation ? 'with affiliation' : 'without affiliation'}`, () => {
        if (role === 'ProjectManager') {
          boolean.forEach((hasAffiliation) => {
            it(`if there already exists a project manager ${hasAffiliation ? 'with affiliation' : 'without affiliation'} in the contributors array, it returns an error`, () => {
              expect(
                addContributor(
                  addWithAffiliation ? selectedPersonWithAffiliation : selectedPersonWithoutAffiliation,
                  hasAffiliation
                    ? contributorsArrayWithProjectManager
                    : contributorsArrayWithProjectManagerWithoutAffiliation,
                  role
                )
              ).toEqual({
                error: AddContributorErrors.ALREADY_HAS_A_PROJECT_MANAGER,
              });
            });
          });
        }
        if (addWithAffiliation) {
          it(`if the person to add comes with several affiliations, it ${role === 'ProjectManager' ? 'returns an error' : 'adds all the affiliations'}`, () => {
            expect(addContributor(selectedPersonWithManyAffiliations, [], role)).toEqual(
              role === 'ProjectManager'
                ? {
                    error: AddContributorErrors.CAN_ONLY_ADD_ONE_PROJECT_MANAGER_ROLE,
                  }
                : {
                    newContributors: [
                      {
                        identity: selectedPersonIdentity,
                        roles: [
                          { type: role, affiliation: abcOrgAsAffiliation },
                          { type: role, affiliation: defOrgAsAffiliation },
                          { type: role, affiliation: ghiOrgAsAffiliation },
                        ],
                      },
                    ],
                  }
            );
          });
        }
        it(`the chosen person is added with role ${role} and affiliation${addWithAffiliation ? '.' : ' undefined.'}`, () => {
          expect(
            addContributor(
              addWithAffiliation ? selectedPersonWithAffiliation : selectedPersonWithoutAffiliation,
              [],
              role
            )
          ).toEqual({
            newContributors: [
              {
                identity: selectedPersonIdentity,
                roles: [
                  {
                    type: role,
                    affiliation: addWithAffiliation ? abcOrgAsAffiliation : undefined,
                  },
                ],
              },
            ],
          });
        });
        contributorTypes.forEach((otherRole) => {
          if (role === otherRole && role === 'ProjectManager') {
            return; // Not possible to add more than one project manager
          }
          boolean.forEach((sameContributor) => {
            describe(`if a contributor with ${sameContributor ? 'the same id' : 'a different id'} exists on ${role === otherRole ? `THE SAME ROLE (${role})` : `a different role: ${otherRole}`}`, () => {
              affiliationStates.forEach((affiliationState) => {
                if (!addWithAffiliation && affiliationState === 'same') {
                  return; // Contradiction so nothing to test here
                }

                it(`with ${sameOtherOrNoAffiliation(addWithAffiliation, affiliationState)}, it ${whatItDoes(role, otherRole, affiliationState, addWithAffiliation, sameContributor)}`, () => {
                  expect(
                    addContributor(
                      addWithAffiliation ? selectedPersonWithAffiliation : selectedPersonWithoutAffiliation,
                      createArrayWithOnePerson(
                        sameContributor ? selectedPersonIdentity : existingPersonIdentity,
                        otherRole,
                        affiliationState === 'same'
                          ? abcOrgAsAffiliation
                          : affiliationState === 'other'
                            ? defOrgAsAffiliation
                            : undefined
                      ),
                      role
                    )
                  ).toEqual(
                    getCorrectContributorsArrayOutput(
                      role,
                      otherRole,
                      affiliationState,
                      addWithAffiliation,
                      sameContributor
                    )
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});
