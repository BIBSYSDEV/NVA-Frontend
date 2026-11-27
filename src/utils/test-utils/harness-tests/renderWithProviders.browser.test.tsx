import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { RootState } from '../../../redux/store';
import { setPartialUser } from '../../../redux/userSlice';
import { mainTheme } from '../../../themes/mainTheme';
import { makeUser } from '../factories/user';
import { renderWithProviders } from '../harness/renderWithProviders';

/**
 * Helper for setting up a basic app with providers so we can test the harness by reading the values back through the
 * hooks a component would use.
 */
const ProviderProbe = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const givenName = useSelector((state: RootState) => state.user?.givenName);
  const retry = useQueryClient().getDefaultOptions().queries?.retry;

  return (
    <dl>
      <dt>Translation</dt>
      <dd>{t('common.page_title')}</dd>
      <dt>Primary color</dt>
      <dd>{theme.palette.primary.main}</dd>
      <dt>Path</dt>
      <dd>{location.pathname}</dd>
      <dt>Given name</dt>
      <dd>{givenName || 'nobody'}</dd>
      <dt>Retry</dt>
      <dd>{String(retry)}</dd>
    </dl>
  );
};

const getValueOf = (term: string) => page.getByRole('definition').and(page.getByText(term, { exact: true }));

describe('renderWithProviders', () => {
  test('renders in the app theme, not the default MUI one', async () => {
    await renderWithProviders(<ProviderProbe />);

    await expect.element(getValueOf(mainTheme.palette.primary.main)).toBeVisible();
  });

  test('renders the translation of a key, not the key itself', async () => {
    await renderWithProviders(<ProviderProbe />);

    await expect.element(getValueOf('Nasjonalt vitenarkiv')).toBeVisible();
  });

  test('renders at the given route', async () => {
    await renderWithProviders(<ProviderProbe />, { route: '/min-side' });

    await expect.element(getValueOf('/min-side')).toBeVisible();
  });

  test('renders at the root when no route is given', async () => {
    await renderWithProviders(<ProviderProbe />);

    await expect.element(getValueOf('/')).toBeVisible();
  });

  test('starts the store from the preloaded state', async () => {
    await renderWithProviders(<ProviderProbe />, { preloadedState: { user: makeUser({ givenName: 'Kari' }) } });

    await expect.element(getValueOf('Kari')).toBeVisible();
  });

  test('starts the store from its initial state when nothing is preloaded', async () => {
    await renderWithProviders(<ProviderProbe />);

    await expect.element(getValueOf('nobody')).toBeVisible();
  });

  test('hands back the store it rendered with, so a test can dispatch to it', async () => {
    const { store } = await renderWithProviders(<ProviderProbe />, {
      preloadedState: { user: makeUser({ givenName: 'Kari' }) },
    });

    store.dispatch(setPartialUser({ givenName: 'Oddny' }));

    await expect.element(getValueOf('Oddny')).toBeVisible();
  });

  test('turns query retries off, so a failing request settles at once', async () => {
    await renderWithProviders(<ProviderProbe />);

    await expect.element(getValueOf('false')).toBeVisible();
  });
});
