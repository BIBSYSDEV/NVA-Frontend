import { describe, expect, test } from 'vitest';
import { RoleName } from '../../../types/user.types';
import { makeUser, makeUserAttributes, makeUserState } from '../factories/user';

const customerId = 'https://api.sikt.no/customer/1234';

describe('makeUserState', () => {
  test('derives the role flags from a token the way the app does when a user signs in', () => {
    const user = makeUserState(
      makeUserAttributes({
        'custom:customerId': customerId,
        'custom:roles': `${RoleName.Creator},${RoleName.Editor}`,
      })
    );

    expect(user.roles).toEqual([RoleName.Creator, RoleName.Editor]);
    expect(user.isCreator).toBe(true);
    expect(user.isEditor).toBe(true);
    expect(user.isNviCurator).toBe(false);
  });

  test('leaves the role flags false for a token without a customer, which the app treats as no privileges', () => {
    const user = makeUserState(makeUserAttributes({ 'custom:roles': RoleName.Creator }));

    expect(user.isCreator).toBe(false);
  });
});

describe('makeUser', () => {
  test('derives the role flags from the roles', () => {
    const user = makeUser({ customerId, roles: [RoleName.Creator] });

    expect(user.isCreator).toBe(true);
    expect(user.isEditor).toBe(false);
  });

  test('leaves the role flags false when the user is not logged in at a customer institution', () => {
    const user = makeUser({ roles: [RoleName.Creator] });

    expect(user.isCreator).toBe(false);
  });

  test('lets an explicit flag override the derived value, so a test can build a state the app would not produce', () => {
    const user = makeUser({ customerId, roles: [RoleName.Creator], isCreator: false });

    expect(user.isCreator).toBe(false);
  });

  // The reducer reads the roles off a comma separated claim, and an empty one splits into [''] rather than an empty
  // list. A user with no roles should hold none, not one that is the empty string.
  test('gives a user without roles an empty list of them', () => {
    const user = makeUser();

    expect(user.roles).toEqual([]);
  });
});
