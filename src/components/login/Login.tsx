import React from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { setUser } from '../../actions/userActions';
import '../../styles/login.scss';
import { RootStore } from '../../reducers/rootReducer';

interface LoginProps {
  buttonText: string;
}

const Login: React.FC<LoginProps> = ({ buttonText }) => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();

  const handleLogin = (event: React.MouseEvent<any>) => {
    // TODO connect with FEIDE with real data
    dispatch(setUser({ firstName: 'Gregor', lastName: 'Gabriel' }));
  };

  return (
    <div className="login">
      {user && user.firstName ? (
        <div className="login__username">Hello {user.firstName}</div>
      ) : (
        <div className="login__button">
          <Button onClick={handleLogin}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
};

export default Login;
