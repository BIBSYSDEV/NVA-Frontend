import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles';

import { interceptRequestsOnMock } from './api/mock-interceptor';
import App from './App';
import store from './redux/store';
import mainTheme from './themes/mainTheme';
import i18n from './translations/i18n';
import { USE_MOCK_DATA } from './utils/constants';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

// Expose redux store to cypress tests
if ((window as any).Cypress) {
  (window as any).store = store;
}
console.log(mainTheme);
ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={mainTheme}>
          <MUIThemeProvider theme={mainTheme}>
            <CssBaseline />
            <App />
          </MUIThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
