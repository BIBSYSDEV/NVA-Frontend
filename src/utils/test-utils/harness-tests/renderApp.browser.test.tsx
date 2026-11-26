import { fetchAuthSession } from 'aws-amplify/auth';
import { describe, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { UrlPathTemplate } from '../../urlPaths';
import { makeUserAttributes } from '../factories/user';
import { defaultUserAttributes, makeAuthSession } from '../harness/auth';
import { renderApp } from '../harness/renderApp';

describe('renderApp', () => {
  test('renders the app itself, not the spinner it starts out as', async () => {
    await renderApp();

    await expect.element(page.getByRole('banner')).toBeVisible();
  });

  test('signs the user in the way the app does when it starts, through the token', async () => {
    const { store } = await renderApp();

    await expect.poll(() => store.getState().user?.givenName).toBe('Test');
    expect(store.getState().user?.isCreator).toBe(true);
  });

  test('lets a test be somebody else by answering with another token', async () => {
    vi.mocked(fetchAuthSession).mockResolvedValue(
      makeAuthSession(makeUserAttributes({ ...defaultUserAttributes, 'custom:firstName': 'Kari' }))
    );

    const { store } = await renderApp();

    await expect.poll(() => store.getState().user?.givenName).toBe('Kari');
  });

  // NOTE: Both of these wait for the app to come up before reading the url. `pushState` has already set it by the time
  // `renderApp` returns, so an assertion made right away would hold even if the app then sent the page somewhere else,
  // which is the one failure these tests exist to catch.
  test('stays at the given url once the app has come up', async () => {
    await renderApp({ route: UrlPathTemplate.Search });

    await expect.element(page.getByRole('banner')).toBeVisible();
    expect(window.location.pathname).toBe(UrlPathTemplate.Search);
  });

  test('stays at the root when no url is given', async () => {
    await renderApp();

    await expect.element(page.getByRole('banner')).toBeVisible();
    expect(window.location.pathname).toBe(UrlPathTemplate.Root);
  });
});
