import { render } from 'vitest-browser-react';
import { App } from '../../../App';
import { AppProviders } from '../../../AppProviders';
import { createStore, RootState } from '../../../redux/store';
import { CustomUserAttributes } from '../../../types/user.types';
import { signIn, signOut } from './auth';
import { testQueryOptions } from './query-options';

interface RenderAppOptions {
  /**
   * The state the store starts from. Any slice left out starts from its own initial state.
   *
   * NOTE: The user is left out of the type here because user data is fetched from the auth token and not from the
   * state. Setting it here would be overwritten when somebody is signed in, and left in place when nobody is — neither
   * of which is what a test asking for it wants. Use the `user` option instead of putting user in preloaded state.
   */
  preloadedState?: Partial<Omit<RootState, 'user'>>;
  /** The url the app starts at. */
  route?: string;
  /**
   * Who the app renders for. Left out it is the default user, and `null` renders it for somebody who is not signed in.
   * `userWithRoles` builds the claims for a test about what a particular role may do.
   */
  user?: CustomUserAttributes | null;
}

/**
 * Renders the whole app the way [src/index.tsx](../../../index.tsx) does, at a url the test decides.
 *
 * The user is the one {@link import('./auth-setup') | auth-setup} signed in, unless the test names another with
 * `user`.
 *
 * NOTE: The url is set on the browser's own history rather than handed to a router. `App` builds its own
 * `createBrowserRouter`, which reads `window.location`, so a router wrapped around the app would be ignored.
 *
 * @returns What `render` returns, plus the store, so a test can dispatch to it or read it back.
 */
export const renderApp = async ({ preloadedState, route = '/', user }: RenderAppOptions = {}) => {
  const store = createStore(preloadedState);

  // NOTE: Left out, the user stays the one the setup file signed in. Only an explicit `user` changes that, which is why
  // `null` is told apart from `undefined` here: `null` is the test saying it wants nobody signed in.
  if (user === null) {
    signOut();
  } else if (user) {
    signIn(user);
  }

  window.history.pushState(null, '', route);

  const result = await render(
    <AppProviders store={store} queryOptions={testQueryOptions}>
      <App />
    </AppProviders>
  );

  return { ...result, store };
};
