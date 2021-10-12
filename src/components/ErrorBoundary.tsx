import { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

type ErrorBoundaryClassProps = RouteComponentProps & WithTranslation;

class ErrorBoundaryClass extends Component<ErrorBoundaryClassProps> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryClassProps) {
    if (this.state.hasError && this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ hasError: false });
    }
  }

  render() {
    const { t, children } = this.props;
    const { hasError } = this.state;

    return hasError ? <h1>{t('common:error_occurred')} &#129301;</h1> : children;
  }
}

export const ErrorBoundary = withTranslation()(withRouter(ErrorBoundaryClass));
