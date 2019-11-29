import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { RootStore } from '../redux/reducers/rootReducer';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const auth = useSelector((store: RootStore) => store.auth);

  return (
    <Route
      {...rest}
      render={props =>
        auth.isLoggedIn ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: '/401', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
