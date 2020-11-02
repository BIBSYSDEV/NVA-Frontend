import React, { FC, ComponentType, ReactNode } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import Forbidden from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<ReactNode>;
  isAuthorized: boolean;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ component: Component, isAuthorized, ...rest }) => (
  <Route {...rest} render={(props) => (isAuthorized ? <Component {...props} {...rest} /> : <Forbidden />)} />
);

export default PrivateRoute;
