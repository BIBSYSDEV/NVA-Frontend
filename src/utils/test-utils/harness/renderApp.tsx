import { render } from 'vitest-browser-react';
import { App } from '../../../App';
import { AppProviders } from '../../../AppProviders';
import { createStore, RootState } from '../../../redux/store';
import { testQueryOptions } from './query-options';

interface RenderAppOptions {
  /** The state the store starts from. Any slice left out starts from its own initial state. */
  preloadedState?: Partial<RootState>;
  /** The url the app starts at. */
  route?: string;
}

/**
 * Renders the whole app the way [src/index.tsx](../../../index.tsx) does, at a url the test decides.
 *
 * The user is the one {@link import('./auth-setup') | auth-setup} signed in. A test that needs somebody else overrides
 * `fetchAuthSession` before calling this.
 *
 * NOTE: The url is set on the browser's own history rather than handed to a router. `App` builds its own
 * `createBrowserRouter`, which reads `window.location`, so a router wrapped around the app would be ignored.
 *
 * @param options Where to render the app, and the state to render it in.
 * @returns What `render` returns, plus the store, so a test can dispatch to it or read it back.
 */
export const renderApp = async (options: RenderAppOptions = {}) => {
  const { preloadedState, route = '/' } = options;
  const store = createStore(preloadedState);

  window.history.pushState(null, '', route);

  const result = await render(
    <AppProviders store={store} queryOptions={testQueryOptions}>
      <App />
    </AppProviders>
  );

  return { ...result, store };
};
