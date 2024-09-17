import { Notifier } from './layout/Notifier';
import { SkipLink } from './components/SkipLink';
import { Header } from './layout/header/Header';
import { EnvironmentBanner } from './components/EnvironmentBanner';
import { Box } from '@mui/material';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { getDateFnsLocale, getDatePickerLocaleText } from './utils/date-helpers';
import { Footer } from './layout/Footer';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

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
            <Outlet />
          </LocalizationProvider>
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  );
};
