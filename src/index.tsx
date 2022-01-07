import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { App } from './App';
import { store } from './redux/store';
import { mainTheme } from './themes/mainTheme';
import i18n from './translations/i18n';
import { USE_MOCK_DATA } from './utils/constants';
import { BasicErrorBoundary } from './components/ErrorBoundary';

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

// Force page refresh if a chunk is not found. This error is usually caused by
// a new version of the app available, and the old chunks currently used are invalidated.
window.addEventListener('error', (error) => {
  if (/Loading chunk [\d]+ failed/.test(error.message)) {
    const localstorageKey = 'appUpdateTime';
    const lastUpdateTime = parseInt(localStorage.getItem(localstorageKey) ?? '');
    const currentTime = Date.now();

    if (!isNaN(lastUpdateTime)) {
      const timeSinceUpdate = currentTime - lastUpdateTime;
      if (timeSinceUpdate < 10000) {
        // Skip refreshing if less than 10sec since previous refresh, to avoid infinite loop
        return;
      }
    }

    window.localStorage.setItem(localstorageKey, currentTime.toString());
    alert(i18n.t('common:reload_page_info'));
    window.location.reload();
  }
});

ReactDOM.render(
  <BasicErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <StyledComponentsThemeProvider theme={mainTheme}>
            <MuiThemeProvider theme={mainTheme}>
              <CssBaseline />
              <App />
            </MuiThemeProvider>
          </StyledComponentsThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </I18nextProvider>
  </BasicErrorBoundary>,
  document.getElementById('root')
);
