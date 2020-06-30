import React, { FC, ComponentType } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import Forbidden from '../../pages/errorpages/Forbidden';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
  isAuthorized: boolean;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ component: Component, isAuthorized, ...rest }) => {
  const user = useSelector((store: RootStore) => store.user);

  return (
    <Route
      {...rest}
      render={(props) => (isAuthorized ? <Component {...props} {...rest} /> : !!user ? <Forbidden /> : null)}
    />
  );
};

export default PrivateRoute;
