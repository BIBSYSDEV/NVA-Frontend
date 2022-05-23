import { ComponentType, ReactNode } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { Forbidden } from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<ReactNode>;
  isAuthorized: boolean;
}

export const PrivateRoute = ({ component: Component, isAuthorized, ...rest }: PrivateRouteProps) => (
  <Route {...rest} render={(props) => (isAuthorized ? <Component {...props} {...rest} /> : <Forbidden />)} />
);
