import { DefaultOptions } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { render } from 'vitest-browser-react';
import { AppProviders } from '../../../AppProviders';
import { createStore, RootState } from '../../../redux/store';

/**
 * Query behaviour every test wants: a failing request should fail once and be done with it
 */
export const testQueryOptions: DefaultOptions = { queries: { retry: false } };

interface RenderWithProvidersOptions {
  /** The state the store starts from. Any slice left out starts from its own initial state. */
  preloadedState?: Partial<RootState>;
  /** The url the component renders at, for components that read the location or render links. */
  route?: string;
}

/**
 * Renders a component in the surroundings the app gives it: the Redux store, react-query, the MUI theme, i18n and a
 * router.
 *
 * @param ui The component to render.
 * @param options Where to render it, and the state to render it in.
 * @returns What `render` returns, plus the store, so a test can dispatch to it or read it back.
 */
export const renderWithProviders = async (ui: ReactNode, options: RenderWithProvidersOptions = {}) => {
  const { preloadedState, route = '/' } = options;
  const store = createStore(preloadedState);

  const Providers = ({ children }: { children: ReactNode }) => (
    <AppProviders store={store} queryOptions={testQueryOptions}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </AppProviders>
  );

  const result = await render(ui, { wrapper: Providers });

  return { ...result, store };
};
