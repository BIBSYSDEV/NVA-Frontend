import { describe, expect, test } from 'vitest';
import { getIdentityServiceErrorCode, getLoginErrorMessageKey, refreshErrorEndsSession } from './auth-error-helpers';

// The identity service puts a problem JSON in the exception message, and Cognito wraps it
const problem = (code: number) =>
  '{\n' +
  `  "type" : "https://api.e2e.nva.aws.unit.no/users-roles/errors/${code}",\n` +
  `  "title" : "IdentityService-${code}: Some reason",\n` +
  '  "status" : 400,\n' +
  '  "detail" : "Some reason"\n' +
  '}';

const inboundFederationError = (code: number) =>
  `InboundFederation lambda invocation failed due to error - ${problem(code)}`;

const preTokenError = (code: number) => `PreTokenGenerationV3_0 failed with error ${problem(code)}.`;

describe('getIdentityServiceErrorCode', () => {
  test('reads the code from an inbound federation error', () => {
    expect(getIdentityServiceErrorCode(inboundFederationError(1005))).toBe(1005);
  });

  test('reads the code from a pre token error', () => {
    expect(getIdentityServiceErrorCode(preTokenError(1004))).toBe(1004);
  });

  test.each([
    undefined,
    '',
    'User cancelled OAuth flow.',
    'invalid_request',
    'See https://api.e2e.nva.aws.unit.no/users-roles/errors/1003',
  ])('returns null for %j', (message) => {
    expect(getIdentityServiceErrorCode(message)).toBeNull();
  });
});

describe('getLoginErrorMessageKey', () => {
  test.each([
    [inboundFederationError(1003), 'feedback.error.login_failed_try_bankid'],
    [preTokenError(1003), 'feedback.error.login_failed_try_bankid'],
    [inboundFederationError(1005), 'feedback.error.login_not_completed'],
    [inboundFederationError(1004), 'feedback.error.login_failed'],
    [inboundFederationError(9999), 'feedback.error.login_failed'],
    ['Something else went wrong', 'feedback.error.login_failed'],
    [undefined, 'feedback.error.login_failed'],
  ])('maps %j to %s', (message, expectedKey) => {
    expect(getLoginErrorMessageKey(message)).toBe(expectedKey);
  });
});

describe('refreshErrorEndsSession', () => {
  test.each([
    [preTokenError(1003), true],
    [preTokenError(1004), true],
    [preTokenError(1005), false],
    ['Network error', false],
    [undefined, false],
  ])('%j gives %s', (message, expected) => {
    expect(refreshErrorEndsSession(message)).toBe(expected);
  });
});
