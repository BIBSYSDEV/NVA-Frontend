// Types for translation keys: https://react.i18next.com/latest/typescript

import nbTranslations from './nbTranslations.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof nbTranslations;
    };
  }
}
