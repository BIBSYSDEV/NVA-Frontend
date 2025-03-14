import { Typography } from '@mui/material';
import { Component, PropsWithChildren } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import nbTranslations from '../translations/nbTranslations.json';
import { LocalStorageKey } from '../utils/constants';

type ErrorBoundaryClassProps = WithTranslation & {
  location: ReturnType<typeof useLocation>;
};

enum ErrorType {
  None,
  Chunk,
  Other,
}

/**
 * Browsers have different error messages when a chunk is not found.
 * This error is often triggered when a new version of the app is deployed with different chunk names than the current version.
 * When this happens the user must reload the page to get the new chunks.
 */
const chunkNotFoundErrorMessages = [
  'TypeError: Failed to fetch dynamically imported module', // Chrome, Edge
  'TypeError: Importing a module script failed', // Safari
  'TypeError: error loading dynamically imported module', // Firefox
];

class ErrorBoundaryClass extends Component<PropsWithChildren<ErrorBoundaryClassProps>> {
  state = { error: ErrorType.None };

  static getDerivedStateFromError(error: any) {
    const errorString = error.toString().toLowerCase();
    const isUpdatedAppError = chunkNotFoundErrorMessages.some((message) => errorString.includes(message.toLowerCase()));
    return isUpdatedAppError ? { error: ErrorType.Chunk } : { error: ErrorType.Other };
  }

  componentDidUpdate(prevProps: ErrorBoundaryClassProps) {
    const { pathname, search } = this.props.location;
    const { error } = this.state;

    if (
      error !== ErrorType.None &&
      (pathname !== prevProps.location.pathname || search !== prevProps.location.search)
    ) {
      this.setState({ error: ErrorType.None });
    }
  }

  // Force page refresh if a chunk is not found. This error is usually caused by a new
  // version of the app being deployed, and the old chunks currently used has been invalidated.
  componentDidCatch() {
    const { t } = this.props;
    const { error } = this.state;

    if (error === ErrorType.Chunk) {
      const lastUpdateTime = parseInt(localStorage.getItem(LocalStorageKey.AppUpdateTime) ?? '');
      const currentTime = Date.now();

      if (!isNaN(lastUpdateTime)) {
        const timeSinceUpdate = currentTime - lastUpdateTime;
        if (timeSinceUpdate < 10000) {
          return; // Skip refreshing if less than 10sec since previous refresh, to avoid infinite loop
        }
      }

      alert(t('common.reload_page_info'));
      localStorage.setItem(LocalStorageKey.AppUpdateTime, currentTime.toString());
      window.location.reload();
    }
  }

  render() {
    const { t, children } = this.props;
    const { error } = this.state;

    switch (error) {
      case ErrorType.None:
        return children;
      case ErrorType.Other:
        return <ErrorMessage errorMessage={t('common.error_occurred')} />;
      case ErrorType.Chunk:
        return null;
    }
  }
}

// Wrapper functional component to provide routing props
const ErrorBoundaryClassWrapper = (props: PropsWithChildren<WithTranslation>) => {
  const location = useLocation();
  return <ErrorBoundaryClass {...props} location={location} />;
};

export const ErrorBoundary = withTranslation()(ErrorBoundaryClassWrapper);

export class BasicErrorBoundary extends Component<PropsWithChildren<unknown>> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? <ErrorMessage errorMessage={nbTranslations.common.error_occurred} /> : children;
  }
}

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => (
  <Typography sx={{ m: '1rem 0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>{errorMessage} &#129301;</Typography>
);
