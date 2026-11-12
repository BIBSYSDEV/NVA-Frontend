import { describe, expect, test } from 'vitest';
import { institutionA } from '../msw/handlers';

/**
 * Proves that the service worker is registered and serving the shared handlers, which is what the browser project needs
 * before a page test can rely on any of them.
 *
 * The two tests belong together. The first one establishes that the worker is running at all. Only given that does the
 * second one mean anything: a cross origin request that no handler covers could also be refused by CORS, so on its own
 * a rejection would not tell us the policy did it.
 */
describe('the shared msw setup in the browser', () => {
  test('serves an organization from the shared handlers', async () => {
    const response = await fetch(institutionA.id);

    await expect(response.json()).resolves.toMatchObject({ id: institutionA.id });
  });

  test('refuses a request that no handler covers', async () => {
    await expect(fetch('https://sikt.no/not-handled')).rejects.toThrow();
  });
});
