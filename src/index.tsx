import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { GlobalStyles, CssBaseline, ThemeProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { App } from './App';
import { store } from './redux/store';
import { mainTheme } from './themes/mainTheme';
import i18n from './translations/i18n';
import { USE_MOCK_DATA } from './utils/constants';
import { BasicErrorBoundary } from './components/ErrorBoundary';

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

const globalStyles = (
  <GlobalStyles
    styles={{
      // Avoid line-breaks for mathjax elements
      'mjx-container': {
        display: 'inline !important',
        fontSize: '100% !important',
      },
      // Avoid redundant clear button for input fields with type="search" on webkit browsers
      "input[type='search']::-webkit-search-cancel-button": {
        WebkitAppearance: 'none',
      },
    }}
  />
);

ReactDOM.render(
  <StrictMode>
    <BasicErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ReduxProvider store={store}>
          <ThemeProvider theme={mainTheme}>
            <CssBaseline />
            {globalStyles}
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </ThemeProvider>
        </ReduxProvider>
      </I18nextProvider>
    </BasicErrorBoundary>
  </StrictMode>,
  document.getElementById('root')
);
