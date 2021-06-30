import React, { ComponentType, ReactNode } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import Forbidden from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<ReactNode>;
  isAuthorized: boolean;
}

const PrivateRoute = ({ component: Component, isAuthorized, ...rest }: PrivateRouteProps) => (
  <Route {...rest} render={(props) => (isAuthorized ? <Component {...props} {...rest} /> : <Forbidden />)} />
);

export default PrivateRoute;
