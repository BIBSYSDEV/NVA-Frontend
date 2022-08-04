import React from 'react';
import ReactDOM from 'react-dom';
import axe from '@axe-core/react';
// import { StrictMode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HelmetProvider } from 'react-helmet-async';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { App } from './App';
import { store } from './redux/store';
import { mainTheme } from './themes/mainTheme';
import i18n from './translations/i18n';
import { USE_MOCK_DATA } from './utils/constants';
import { BasicErrorBoundary } from './components/ErrorBoundary';

// Fonts
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/crimson-text/400.css';

if (process.env.NODE_ENV !== 'production') {
  // import('@axe-core/react').then((axe: any) => {
  //   axe(React, ReactDOM, 1000); // WHY U NO WORK???111!!+?
  // });
  axe(React, ReactDOM, 1000);
}

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

// Expose redux store to cypress tests
if ((window as any).Cypress) {
  (window as any).store = store;
}

ReactDOM.render(
  // <StrictMode>
  <BasicErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <ReduxProvider store={store}>
        <ThemeProvider theme={mainTheme}>
          <CssBaseline />
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ThemeProvider>
      </ReduxProvider>
    </I18nextProvider>
  </BasicErrorBoundary>,
  //  </StrictMode>
  document.getElementById('root')
);
