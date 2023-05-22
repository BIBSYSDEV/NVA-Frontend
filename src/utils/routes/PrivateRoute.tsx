import { Route, RouteProps } from 'react-router-dom';
import { Forbidden } from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  isAuthorized: boolean;
}

export const PrivateRoute = ({ component, children, isAuthorized, ...rest }: PrivateRouteProps) => {
  if (!isAuthorized) {
    return (
      <Route {...rest}>
        <Forbidden />;
      </Route>
    );
  } else if (component) {
    return <Route {...rest} component={component} />;
  } else if (children) {
    return <Route {...rest}>{children}</Route>;
  } else {
    return null;
  }
};
