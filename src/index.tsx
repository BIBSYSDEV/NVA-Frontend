import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { App } from './App';
import { store } from './redux/store';
import { lightTheme } from './themes/lightTheme';
import i18n from './translations/i18n';
import { USE_MOCK_DATA } from './utils/constants';

// Fonts
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/crimson-text/400.css';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

// Expose redux store to cypress tests
if ((window as any).Cypress) {
  (window as any).store = store;
}

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <StyledComponentsThemeProvider theme={lightTheme}>
          <MuiThemeProvider theme={lightTheme}>
            <CssBaseline />
            <App />
          </MuiThemeProvider>
        </StyledComponentsThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
