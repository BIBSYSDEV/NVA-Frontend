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
import { loginFailureAction, loginSuccessAction } from '../redux/actions/authActions';
import { clearFeedbackAction } from '../redux/actions/feedbackActions';
import { orcidRequestFailureAction, orcidSignInFailureAction } from '../redux/actions/orcidActions';
import { searchFailure } from '../redux/actions/searchActions';
import { setUserFailureAction } from '../redux/actions/userActions';
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

  test('shows login success message when logging in successfully', async () => {
    store.dispatch(loginSuccessAction());
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Logged in');
  });

  test('shows login error message when login failed', async () => {
    store.dispatch(loginFailureAction('ErrorMessage.Login failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Login failed');
  });

  test('shows error message when failing to get authenticated user', async () => {
    store.dispatch(setUserFailureAction('ErrorMessage.Failed to get user'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Failed to get user');
  });

  test('shows orcid request error message when connecting to ORCID failed', async () => {
    store.dispatch(orcidRequestFailureAction('ErrorMessage.ORCID request failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Could not get data from ORCID');
  });

  test('shows orcid request error message when logging in to ORCID failed', async () => {
    store.dispatch(orcidSignInFailureAction('ErrorMessage.ORCID login failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('ORCID login failed');
  });

  test('shows search error message when search failed', async () => {
    store.dispatch(searchFailure('ErrorMessage.Search failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Search failed');
  });

  afterEach(() => {
    store.dispatch(clearFeedbackAction());
    cleanup();
  });
});
