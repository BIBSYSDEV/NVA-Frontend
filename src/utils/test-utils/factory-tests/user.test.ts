import { describe, expect, test } from 'vitest';
import { RoleName } from '../../../types/user.types';
import { makeUser } from '../factories/user';

describe('makeUser', () => {
  const customerId = 'https://api.test.nva.aws.unit.no/customer/1234';

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
});
