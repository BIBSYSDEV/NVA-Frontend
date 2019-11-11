import './styles/index.scss';

import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as MUIThemeProvider, StylesProvider } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import i18n from './translations/i18n';
import mainTheme from './themes/mainTheme';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './App';
import store from './redux/store';

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
              action={key => (
                <IconButton onClick={onClickDismiss(key)}>
                  <CloseIcon />
                </IconButton>
              )}
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
