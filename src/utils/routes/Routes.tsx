import { Route, RouteProps } from 'react-router-dom';
import { Forbidden } from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  isAuthorized: boolean;
}

export const PrivateRoute = ({ isAuthorized, ...rest }: PrivateRouteProps) =>
  isAuthorized ? (
    <Route {...rest} />
  ) : (
    <Route {...rest}>
      <Forbidden />
    </Route>
  );
