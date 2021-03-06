import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
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
      <StylesProvider injectFirst>
        <ThemeProvider theme={lightTheme}>
          <MUIThemeProvider theme={lightTheme}>
            <CssBaseline />
            <App />
          </MUIThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
