import { CssBaseline, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { App } from './App';
import { QueryProvider } from './QueryProvider';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { DocumentHeadTitleProvider } from './components/DocumentHeadTitle';
import { BasicErrorBoundary } from './components/ErrorBoundary';
import { store } from './redux/store';
import { mainTheme } from './themes/mainTheme';
import i18n from './translations/i18n';
import { USE_MOCK_DATA } from './utils/constants';

// Fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

// Expose redux store to cypress tests
if ((window as any).Cypress) {
  (window as any).store = store;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <BasicErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <ReduxProvider store={store}>
            <ThemeProvider theme={mainTheme}>
              <CssBaseline />
              <DocumentHeadTitleProvider>
                <QueryProvider>
                  <App />
                </QueryProvider>
              </DocumentHeadTitleProvider>
            </ThemeProvider>
          </ReduxProvider>
        </I18nextProvider>
      </BasicErrorBoundary>
    </StrictMode>
  );
}
