import { Component, PropsWithChildren } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import nbTranslations from '../translations/nbTranslations.json';
import { LocalStorageKey } from '../utils/constants';

type ErrorBoundaryClassProps = RouteComponentProps & WithTranslation;

class ErrorBoundaryClass extends Component<PropsWithChildren<ErrorBoundaryClassProps>> {
  state = { hasError: false, chunkError: false };

  static getDerivedStateFromError(error: any) {
    if (/Loading chunk [\d]+ failed/.test(error)) {
      return { hasError: true, chunkError: true };
    } else {
      return { hasError: true, chunkError: false };
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryClassProps) {
    const { pathname, search } = this.props.location;
    const { hasError } = this.state;

    if (hasError && (pathname !== prevProps.location.pathname || search !== prevProps.location.search)) {
      this.setState({ hasError: false, chunkError: false });
    }
  }

  // Force page refresh if a chunk is not found. This error is usually caused by a new
  // version of the app being deployed, and the old chunks currently used has been invalidated.
  componentDidCatch() {
    const { t } = this.props;
    const { chunkError } = this.state;

    if (chunkError) {
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
    const { hasError, chunkError } = this.state;

    if (hasError) {
      return chunkError ? null : <ErrorMessage errorMessage={t('common.error_occurred')} />;
    }

    return children;
  }
}

export const ErrorBoundary = withTranslation()(withRouter(ErrorBoundaryClass));

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

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => <h1>{errorMessage} &#129301;</h1>;
