import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { EnvironmentBanner } from './components/EnvironmentBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageSpinner } from './components/PageSpinner';
import { SkipLink } from './components/SkipLink';
import { Footer } from './layout/Footer';
import { Header } from './layout/header/Header';
import { Notifier } from './layout/Notifier';
import { getDateFnsLocale, getDatePickerLocaleText } from './utils/date-helpers';

export const Layout = () => {
  const { t, i18n } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Notifier />
      <SkipLink href="#main-content">{t('common.skip_to_main_content')}</SkipLink>
      <Header />
      <EnvironmentBanner />
      <Box
        component="main"
        id="main-content"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          flexGrow: 1,
          mb: '0.5rem',
        }}>
        <ErrorBoundary>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={getDateFnsLocale(i18n.language)}
            dateFormats={{ keyboardDate: 'dd.MM.yyyy' }}
            localeText={getDatePickerLocaleText(i18n.language)}>
            <Suspense fallback={<PageSpinner aria-label={t('common.page_title')} />}>
              <Outlet />
            </Suspense>
          </LocalizationProvider>
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  );
};
