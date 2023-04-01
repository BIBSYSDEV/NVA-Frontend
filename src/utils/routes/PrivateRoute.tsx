import { ComponentType } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { Forbidden } from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  isAuthorized: boolean;
}

export const PrivateRoute = ({ component: ProtectedComponent, isAuthorized, ...rest }: PrivateRouteProps) => (
  <Route {...rest} render={(props) => (isAuthorized ? <ProtectedComponent {...props} {...rest} /> : <Forbidden />)} />
);
