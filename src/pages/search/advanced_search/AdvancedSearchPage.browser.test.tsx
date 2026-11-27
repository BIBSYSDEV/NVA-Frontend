import { http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { SearchApiPath } from '../../../api/apiPaths';
import { RegistrationSearchItem } from '../../../types/registration.types';
import { makeRegistrationSearchItem, makeSearchResponse2 } from '../../../utils/test-utils/factories/search';
import { renderApp } from '../../../utils/test-utils/harness/renderApp';
import { worker } from '../../../utils/test-utils/msw/browser';
import { apiBaseUrl } from '../../../utils/test-utils/msw/urls';
import { UrlPathTemplate } from '../../../utils/urlPaths';

const mainTitle = 'Havforsuring i Barentshavet';

// NOTE: The page searches as soon as it mounts, so this is the answer to that search — nobody has to type anything. If
// that changes, these tests go red without saying why.
const searchFinds = (...hits: RegistrationSearchItem[]) =>
  worker.use(
    http.get(`${apiBaseUrl}${SearchApiPath.Registrations}`, () => HttpResponse.json(makeSearchResponse2({ hits })))
  );

describe('the search page', () => {
  test('shows a result the api answered with', async () => {
    searchFinds(makeRegistrationSearchItem({ mainTitle }));

    await renderApp({ route: UrlPathTemplate.Search });

    await expect.element(page.getByText(mainTitle)).toBeVisible();
  });

  test('shows the same result to a visitor who is not signed in', async () => {
    searchFinds(makeRegistrationSearchItem({ mainTitle }));

    await renderApp({ route: UrlPathTemplate.Search, user: null });

    await expect.element(page.getByText(mainTitle)).toBeVisible();
  });
});
