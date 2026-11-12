import { HttpNetworkFrame } from 'msw/experimental';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { worker } from './browser';

beforeAll(async () => {
  await worker.start({
    quiet: true,
    /**
     * Handles requests that no handler matches, i.e. api-endpoints that doesn't exist or that we forgot to make
     * handlers for
     */
    onUnhandledFrame({ frame, defaults }) {
      // In the browser the worker intercepts everything the page fetches, not only calls to the API. Erroring on all of
      // them would fail every test before it ran, so only a request leaving the page's origin is held to the policy.
      // NOTE: Due to the origin check, the use of `API_URL` in constants.ts requires that `VITE_API_HOST` is set. If not,
      // an API call without a matching handler, made to a relative URL would be quietly let through instead of failing.
      if (frame instanceof HttpNetworkFrame && new URL(frame.data.request.url).origin !== location.origin) {
        defaults.error();
      }
    },
  });
});

// NOTE: A test may add a handler of its own with worker.use(). Without this reset that handler would still be in place
// in the next test, which fails depending on the order the tests ran in.
afterEach(() => {
  worker.resetHandlers();
});

afterAll(() => {
  worker.stop();
});
