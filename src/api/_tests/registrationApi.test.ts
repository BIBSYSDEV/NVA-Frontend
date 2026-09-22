import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Registration } from '../../types/registration.types';
import { authenticatedApiRequest, authenticatedApiRequest2 } from '../apiRequest';
import { fetchRegistration, partialUpdateRegistration, updateRegistration } from '../registrationApi';

vi.mock('../apiRequest', () => ({
  authenticatedApiRequest: vi.fn(),
  authenticatedApiRequest2: vi.fn(),
  apiRequest2: vi.fn(),
}));

vi.mock('../authApi', () => ({
  userIsAuthenticated: () => Promise.resolve(true),
}));

const makeRegistration = (overrides: Partial<Registration> = {}) =>
  ({
    identifier: 'registration-1',
    ...overrides,
  }) as Registration;

const makeResponse = (data: Partial<Registration>, { status = 200, etag }: { status?: number; etag?: string } = {}) =>
  ({
    status,
    data,
    headers: etag ? { etag } : {},
  }) as AxiosResponse<Registration>;

const updateRequestConfig = (callIndex = 0): AxiosRequestConfig =>
  vi.mocked(authenticatedApiRequest).mock.calls[callIndex][0];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateRegistration()', () => {
  test('Sends the ETag of the registration as If-Match', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration(), { etag: '"v2"' }));

    await updateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRequestConfig().headers).toEqual({ 'If-Match': '"v1"' });
  });

  test('Does not send the ETag in the request body', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration(), { etag: '"v2"' }));

    await updateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRequestConfig().data).not.toHaveProperty('etag');
  });

  test('Merges the ETag from the response onto the returned registration', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration(), { etag: '"v2"' }));

    const updateRegistrationResponse = await updateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRegistrationResponse.data.etag).toBe('"v2"');
  });

  test('Sends the ETag from the previous update when the same registration is updated twice', async () => {
    vi.mocked(authenticatedApiRequest)
      .mockResolvedValueOnce(makeResponse(makeRegistration(), { etag: '"v2"' }))
      .mockResolvedValueOnce(makeResponse(makeRegistration(), { etag: '"v3"' }));

    const firstUpdate = await updateRegistration(makeRegistration({ etag: '"v1"' }));
    await updateRegistration(firstUpdate.data);

    expect(updateRequestConfig(0).headers).toEqual({ 'If-Match': '"v1"' });
    expect(updateRequestConfig(1).headers).toEqual({ 'If-Match': '"v2"' });
  });

  test('Fetches a fresh ETag when the update response has no ETag header', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration()));
    vi.mocked(authenticatedApiRequest2).mockResolvedValue(makeResponse(makeRegistration(), { etag: '"v2"' }));

    const updateRegistrationResponse = await updateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRegistrationResponse.data.etag).toBe('"v2"');
  });

  test('Ignores a refreshed registration with another identifier, to avoid resetting the form to a redirected registration', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration()));
    vi.mocked(authenticatedApiRequest2).mockResolvedValue(
      makeResponse(makeRegistration({ identifier: 'registration-2' }), { etag: '"v2"' })
    );

    const updateRegistrationResponse = await updateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRegistrationResponse.data).not.toHaveProperty('etag');
    expect(updateRegistrationResponse.data.identifier).toBe('registration-1');
  });

  test('Returns a successful response even if the ETag cannot be refreshed', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration()));
    vi.mocked(authenticatedApiRequest2).mockRejectedValue(new Error('Failed to fetch registration'));

    const updateRegistrationResponse = await updateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRegistrationResponse.status).toBe(200);
    expect(updateRegistrationResponse.data).not.toHaveProperty('etag');
  });

  test('Does not touch the data of an error response', async () => {
    const preconditionFailedResponse = makeResponse({}, { status: 412, etag: '"v2"' });
    vi.mocked(authenticatedApiRequest).mockResolvedValue(preconditionFailedResponse);

    const updateRegistrationResponse = await updateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRegistrationResponse.data).toBe(preconditionFailedResponse.data);
    expect(vi.mocked(authenticatedApiRequest2)).not.toHaveBeenCalled();
  });
});

describe('partialUpdateRegistration()', () => {
  test('Sends the ETag of the registration as If-Match', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration(), { etag: '"v2"' }));

    await partialUpdateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(updateRequestConfig().headers).toEqual({ 'If-Match': '"v1"' });
  });

  test('Merges the ETag from the response onto the returned registration', async () => {
    vi.mocked(authenticatedApiRequest).mockResolvedValue(makeResponse(makeRegistration(), { etag: '"v2"' }));

    const partialUpdateRegistrationResponse = await partialUpdateRegistration(makeRegistration({ etag: '"v1"' }));

    expect(partialUpdateRegistrationResponse.data.etag).toBe('"v2"');
  });
});

describe('fetchRegistration()', () => {
  test('Merges the ETag from the response onto the registration', async () => {
    vi.mocked(authenticatedApiRequest2).mockResolvedValue(makeResponse(makeRegistration(), { etag: '"v1"' }));

    const registration = await fetchRegistration('registration-1');

    expect(registration.etag).toBe('"v1"');
  });

  test('Returns the registration without an ETag when the response has no ETag header', async () => {
    vi.mocked(authenticatedApiRequest2).mockResolvedValue(makeResponse(makeRegistration()));

    const registration = await fetchRegistration('registration-1');

    expect(registration).not.toHaveProperty('etag');
  });
});
