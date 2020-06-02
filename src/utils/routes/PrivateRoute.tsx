import React, { FC, ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
  isAuthorized: boolean;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ component: Component, isAuthorized, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthorized ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
);

export default PrivateRoute;
