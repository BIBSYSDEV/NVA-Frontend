import axios from 'axios';
import { describe, expect, test } from 'vitest';

/**
 * The shared setup in msw/unit-setup.ts starts the server with `onUnhandledFrame: 'error'`, so that a request no
 * handler covers fails the test instead of going out to the real network.
 *
 * The assertion matches the message from MSW rather than accepting any rejection. A bare rejection would also happen if
 * the server were not running at all and the request reached the real host, which is the very thing this test exists to
 * rule out.
 */
describe('the shared msw setup', () => {
  test('refuses a request that no handler covers', async () => {
    await expect(axios.get('https://sikt.no/not-handled')).rejects.toThrow(/onUnhandledFrame/);
  });
});
