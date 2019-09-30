import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      translations: {
        Create: 'Create',
        Dashboard: 'Dashboard',
        Email: 'Email',
        Hello: 'Hello',
        'Invalid email': 'Invalid email',
        Menu: 'Menu',
        'My profile': 'My profile',
        'New resource': 'New resource',
        Password: 'Password',
        'Register new resource': 'Register new resource',
        Reset: 'Reset',
        'Required field': 'Required field',
      },
    },
    nb: {
      translations: {
        Create: 'Opprett',
        Dashboard: 'Dashboard',
        Email: 'Epost',
        Hello: 'Hallo',
        'Invalid email': 'Ugyldig epost',
        Menu: 'Meny',
        'My profile': 'Min profil',
        'New resource': 'Ny ressurs',
        Password: 'Passord',
        'Register new resource': 'Registrer ny ressurs',
        Reset: 'Reset',
        'Required field': 'Påkrevd felt',
      },
    },
  },
  fallbackLng: 'nb',
  debug: true,
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

export default i18n;
