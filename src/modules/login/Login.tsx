import '../../styles/login.scss';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Typography } from '@material-ui/core';

import { login, logout } from '../../api/user';
import { RootStore } from '../../reducers/rootReducer';

interface LoginProps {
  buttonText: string;
}

const Login: React.FC<LoginProps> = ({ buttonText }) => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(login());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="auth">
      {user && user.name ? (
        <>
          <div className="auth__username">
            <Typography variant="subtitle1">{user.name}</Typography>
          </div>
          <div className="auth__logout__button">
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </>
      ) : (
        <div className="auth__login__button">
          <Button onClick={handleLogin}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
};

export default Login;
