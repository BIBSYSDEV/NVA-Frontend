import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});

// NOTE: A test may add a handler of its own with server.use(). Without this reset that handler would still be in place
// in the next test, which fails depending on the order the tests ran in.
afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
