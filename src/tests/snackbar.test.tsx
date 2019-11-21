import { createBrowserHistory } from 'history';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import { ThemeProvider } from 'styled-components';

import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
import { cleanup, getByTestId, render, wait } from '@testing-library/react';

import App from '../App';
import { loginFailure } from '../redux/actions/authActions';
import { clearNotifications } from '../redux/actions/notificationActions';
import { orcidRequestFailure, orcidSignInFailure } from '../redux/actions/orcidActions';
import { searchFailure } from '../redux/actions/searchActions';
import { setUserFailure } from '../redux/actions/userActions';
import rootReducer from '../redux/reducers/rootReducer';
import mainTheme from '../themes/mainTheme';
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
          <StylesProvider injectFirst>
            <ThemeProvider theme={mainTheme}>
              <MUIThemeProvider theme={mainTheme}>
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
              </MUIThemeProvider>
            </ThemeProvider>
          </StylesProvider>
        </I18nextProvider>
      </Provider>
    );
  });

  test('shows login error message when login failed', async () => {
    store.dispatch(loginFailure('Login failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Login failed');
  });

  test('shows error message when failing to get authenticated user', async () => {
    store.dispatch(setUserFailure('Failed to get user'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Failed to get user');
  });

  test('shows orcid request error message when connecting to ORCID failed', async () => {
    store.dispatch(orcidRequestFailure('Could not get data from ORCID'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Could not get data from ORCID');
  });

  test('shows orcid request error message when logging in to ORCID failed', async () => {
    store.dispatch(orcidSignInFailure('ORCID login failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('ORCID login failed');
  });

  test('shows search error message when search failed', async () => {
    store.dispatch(searchFailure('Search failed'));
    await wait(() => getByTestId(app.container, 'snackbar'));
    expect(getByTestId(app.container, 'snackbar').textContent).toBe('Search failed');
  });

  afterEach(() => {
    store.dispatch(clearNotifications());
    cleanup();
  });
});
