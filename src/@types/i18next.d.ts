// https://www.i18next.com/overview/typescript

import 'i18next';
import nbTranslations from '../translations/nbTranslations.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof nbTranslations;
    };
  }
}
