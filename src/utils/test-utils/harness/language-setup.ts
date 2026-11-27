import { beforeAll } from 'vitest';
import i18n from '../../../translations/i18n';

/**
 * The language the interface renders in while tests run, so that a test can assert on the text a user would read.
 *
 * NOTE: Using Norwegian bokmål, because `nbTranslations.json` is the file that is kept current.
 */
const testLanguage = 'nob';

// NOTE: Without this the language is whatever `LanguageDetector` reads off the browser the tests happen to run in,
// which makes any assertion on interface text depend on the machine it runs on.
beforeAll(async () => {
  await i18n.changeLanguage(testLanguage);
});
