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

import App from './App';
import { clearFeedback } from './redux/actions/feedbackActions';
import store from './redux/store';
import mainTheme from './themes/mainTheme';
import i18n from './translations/i18n';

const notistackRef = React.createRef<any>();
const onClickDismiss = (key: any) => () => {
  notistackRef.current.closeSnackbar(key);
};

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={mainTheme}>
          <MUIThemeProvider theme={mainTheme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              data-testid="snackbar"
              action={key => {
                return (
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      onClickDismiss(key);
                      store.dispatch(clearFeedback());
                    }}>
                    <CloseIcon />
                  </IconButton>
                );
              }}
              ref={notistackRef}>
              <App />
            </SnackbarProvider>
          </MUIThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
