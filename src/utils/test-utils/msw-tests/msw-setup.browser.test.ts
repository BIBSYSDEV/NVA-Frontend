import { afterEach, describe, expect, test, vi } from 'vitest';
import { institutionA } from '../msw/fixtures/organizations';
import { unhandledUrl } from '../msw/urls';

/**
 * Proves that the service worker is registered and serving the shared handlers, which is what the browser project needs
 * before a page test can rely on any of them.
 *
 * NOTE: The second test asserts on what MSW writes to the console, not merely that the request failed. A request that
 * leaves the page's origin fails on CORS as well, so a bare rejection would pass just as readily with the policy
 * switched off.
 */
describe('the shared msw setup in the browser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('serves an organization from the shared handlers', async () => {
    const response = await fetch(institutionA.id);

    await expect(response.json()).resolves.toMatchObject({ id: institutionA.id });
  });

  test('refuses a request that no handler covers', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(fetch(unhandledUrl)).rejects.toThrow();

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('without a matching request handler'));
  });
});
