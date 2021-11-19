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
