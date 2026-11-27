import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { RoleName } from '../../../types/user.types';
import { UrlPathTemplate } from '../../urlPaths';
import { defaultUserAttributes, userWithRoles } from '../harness/auth';
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

  test('signs in the user the test names instead of the default one', async () => {
    const { store } = await renderApp({
      user: { ...defaultUserAttributes, 'custom:firstName': 'Kari' },
    });

    await expect.poll(() => store.getState().user?.givenName).toBe('Kari');
  });

  test('gives the user the roles the test asks for', async () => {
    const { store } = await renderApp({ user: userWithRoles(RoleName.NviCurator) });

    await expect.poll(() => store.getState().user?.isNviCurator).toBe(true);
    expect(store.getState().user?.isCreator).toBe(false);
  });

  test('renders for a visitor who is not signed in', async () => {
    const { store } = await renderApp({ user: null });

    await expect.element(page.getByRole('banner')).toBeVisible();
    expect(store.getState().user).toBeNull();
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
