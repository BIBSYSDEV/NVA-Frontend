import './styles/index.scss';

import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import i18n from './translations/i18n';

const notistackRef = React.createRef<any>();
const onClickDismiss = (key: any) => () => {
  notistackRef.current.closeSnackbar(key);
};

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        action={key => (
          <IconButton onClick={onClickDismiss(key)}>
            <CloseIcon />
          </IconButton>
        )}
        ref={notistackRef}>
        <App />
      </SnackbarProvider>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
