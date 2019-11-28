import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { RootStore } from '../redux/reducers/rootReducer';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  isAuthorized?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, isAuthorized, ...rest }) => {
  const auth = useSelector((store: RootStore) => store.auth);
  const autorized = isAuthorized ? isAuthorized : auth.isLoggedIn;

  return (
    <Route
      {...rest}
      render={props =>
        autorized ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: '/401', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
