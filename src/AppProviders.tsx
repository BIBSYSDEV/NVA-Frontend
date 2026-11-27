import { CssBaseline, ThemeProvider } from '@mui/material';
import { DefaultOptions } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { HeadTitleProvider } from './components/HeadTitle';
import { QueryProvider } from './QueryProvider';
import { AppStore } from './redux/store';
import { mainTheme } from './themes/mainTheme';
import i18n from './translations/i18n';

interface AppProvidersProps {
  children: ReactNode;
  /** The store to render against: the app's own, or one a test built for itself. */
  store: AppStore;
  /** Overrides merged into the default query options. */
  queryOptions?: DefaultOptions;
}

/**
 * Everything the app needs around it before any of it can render: the Redux store, react-query, the MUI theme, i18n
 * and the page title.
 *
 * A test renders through this rather than building a provider tree of its own.
 *
 * NOTE: `StrictMode` and `BasicErrorBoundary` are deliberately not part of this. They sit outside it in
 * [src/index.tsx](./index.tsx), and a test wants neither: the error boundary would swallow the render errors the test
 * exists to surface, and StrictMode's double invoked effects would fire every request twice.
 */
export const AppProviders = ({ children, store, queryOptions }: AppProvidersProps) => (
  <I18nextProvider i18n={i18n}>
    <ReduxProvider store={store}>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <HeadTitleProvider>
          <QueryProvider defaultOptions={queryOptions}>{children}</QueryProvider>
        </HeadTitleProvider>
      </ThemeProvider>
    </ReduxProvider>
  </I18nextProvider>
);
