import { createBrowserHistory } from 'history';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';

import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { cleanup, getByTestId, render, wait } from '@testing-library/react';

import App from '../App';
import { loginFailureAction } from '../redux/actions/authActions';
import { clearFeedbackAction } from '../redux/actions/feedbackActions';
import { orcidRequestFailureAction } from '../redux/actions/orcidActions';
import rootReducer from '../redux/reducers/rootReducer';
import i18n from '../translations/i18n';

describe('Snackbar', () => {
  let app: any;
  const store = createStore(rootReducer);
  const history = createBrowserHistory();

  beforeEach(() => {
    const notistackRef = React.createRef<any>();
    const onClickDismiss = (key: any) => () => {
      notistackRef.current.closeSnackbar(key);
    };
    app = render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <SnackbarProvider
            maxSnack={3}
            data-testid="snackbar"
            action={key => (
              <IconButton onClick={onClickDismiss(key)}>
                <CloseIcon />
              </IconButton>
            )}
            ref={notistackRef}>
            <Router history={history}>
              <App />
            </Router>
          </SnackbarProvider>
        </I18nextProvider>
      </Provider>
    );
  });

  test('shows login error message when login failed', async () => {
    store.dispatch(loginFailureAction('ErrorMessage.Login failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Login failed');
  });

  test('shows orcid request error message when connecting to ORCID failed', async () => {
    store.dispatch(orcidRequestFailureAction('ErrorMessage.ORCID request failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Could not get data from ORCID');
  });

  afterEach(() => {
    store.dispatch(clearFeedbackAction());
    cleanup();
  });
});
