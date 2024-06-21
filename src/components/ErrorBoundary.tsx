import { Component, PropsWithChildren } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import nbTranslations from '../translations/nbTranslations.json';
import { LocalStorageKey } from '../utils/constants';

type ErrorBoundaryClassProps = RouteComponentProps & WithTranslation;

enum ErrorType {
  None,
  Chunk,
  Other,
}

class ErrorBoundaryClass extends Component<PropsWithChildren<ErrorBoundaryClassProps>> {
  state = { error: ErrorType.None };

  static getDerivedStateFromError(error: any) {
    console.log('ERROR', error);

    return /TypeError: error loading dynamically imported module/.test(error)
      ? { error: ErrorType.Chunk }
      : { error: ErrorType.Other };
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

    console.log('Error boundary', this.state);

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

export const ErrorBoundary = withTranslation()(withRouter(ErrorBoundaryClass));

export class BasicErrorBoundary extends Component<PropsWithChildren<unknown>> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    console.log('Most basic error boundary', this.state);

    return hasError ? <ErrorMessage errorMessage={nbTranslations.common.error_occurred} /> : children;
  }
}

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => <h1>{errorMessage} &#129301;</h1>;
