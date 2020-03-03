import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { IconButton } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import CloseIcon from '@material-ui/icons/Close';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles';

import { interceptRequestsOnMock } from './api/mock-interceptor';
import App from './App';
import store from './redux/store';
import mainTheme from './themes/mainTheme';
import i18n from './translations/i18n';
import { MAX_NOTIFICATIONS, USE_MOCK_DATA } from './utils/constants';

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
        <ThemeProvider theme={mainTheme}>
          <MUIThemeProvider theme={mainTheme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={MAX_NOTIFICATIONS}
              data-testid="snackbar"
              action={
                <IconButton color="inherit">
                  <CloseIcon />
                </IconButton>
              }>
              <App />
            </SnackbarProvider>
          </MUIThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
