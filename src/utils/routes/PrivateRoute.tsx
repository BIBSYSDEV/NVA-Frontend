import { Component, ComponentType, PropsWithChildren, ReactNode } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { Forbidden } from '../../pages/errorpages/Forbidden';

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<PropsWithChildren<ReactNode>>;
  isAuthorized: boolean;
}

export const PrivateRoute = ({ component, isAuthorized, ...rest }: PrivateRouteProps) => (
  <Route {...rest} render={(props) => (isAuthorized ? <Component {...props} {...rest} /> : <Forbidden />)} />
);
