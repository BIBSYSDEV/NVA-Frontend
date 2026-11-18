import { HttpNetworkFrame } from 'msw/experimental';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { worker } from './browser';

beforeAll(async () => {
  await worker.start({
    quiet: true,
    onUnhandledFrame({ frame, defaults }) {
      // NOTE: In the browser the worker intercepts everything the page fetches, not only calls to the API. Erroring on
      // all of it would fail every test before it ran, so only a request leaving the page's origin is held to the
      // policy. That is also why `VITE_API_HOST` is set in `.env.test`: without it `API_URL` is empty, the app's own
      // requests are relative, and an unhandled one would be let through instead of failing.
      const isRequestLeavingPage =
        frame instanceof HttpNetworkFrame && new URL(frame.data.request.url).origin !== location.origin;

      if (isRequestLeavingPage) {
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
