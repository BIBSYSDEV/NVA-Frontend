import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import axios from 'axios';

import { IconButton } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import CloseIcon from '@material-ui/icons/Close';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles';

import App from './App';
import store from './redux/store';
import mainTheme from './themes/mainTheme';
import i18n from './translations/i18n';
import { API_URL, MAX_NOTIFICATIONS /*API_URL, API_TOKEN*/ } from './utils/constants';

// Set global config of axios requests
axios.defaults.baseURL = API_URL;

// TODO: Set global config auth only when backend is ready
axios.defaults.headers.common = {
  // Authorization: `Bearer ${API_TOKEN}`,
  Accept: 'application/json',
};
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

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
