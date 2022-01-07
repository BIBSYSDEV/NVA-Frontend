import { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import commonNb from '../translations/nb/common.json';

type ErrorBoundaryClassProps = RouteComponentProps & WithTranslation;

class ErrorBoundaryClass extends Component<ErrorBoundaryClassProps> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryClassProps) {
    const { pathname, search } = this.props.location;
    const { hasError } = this.state;

    if (hasError && (pathname !== prevProps.location.pathname || search !== prevProps.location.search)) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: any) {
    const { t } = this.props;
    console.log('ErrorBoundaryClass', error);

    if (/Loading chunk [\d]+ failed/.test(error)) {
      console.log('heisann, fant feilen jooo!!');
      const localstorageKey = 'appUpdateTime';
      const lastUpdateTime = parseInt(localStorage.getItem(localstorageKey) ?? '');
      const currentTime = Date.now();

      if (!isNaN(lastUpdateTime)) {
        const timeSinceUpdate = currentTime - lastUpdateTime;
        if (timeSinceUpdate < 10000) {
          // Skip refreshing if less than 10sec since previous refresh, to avoid infinite loop
          return;
        }
      }

      window.localStorage.setItem(localstorageKey, currentTime.toString());
      alert(t('common:reload_page_info'));
      window.location.reload();
    }
  }

  render() {
    const { t, children } = this.props;
    const { hasError } = this.state;

    return hasError ? <ErrorMessage errorMessage={t('common:error_occurred')} /> : children;
  }
}

export const ErrorBoundary = withTranslation()(withRouter(ErrorBoundaryClass));

export class BasicErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.log('BasicErrorBoundary', error, info);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? <ErrorMessage errorMessage={commonNb.error_occurred} /> : children;
  }
}

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => <h1>{errorMessage} &#129301;</h1>;
