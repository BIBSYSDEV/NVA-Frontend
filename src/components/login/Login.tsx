import React from 'react';
import { Button } from '@material-ui/core';

interface LoginProps {
  buttonText: string;
}

const Login: React.FC<LoginProps> = ({ buttonText }) => {
  const handleLogin = (event: React.MouseEvent<any>) => {
    console.log('Clicked login');
  };
  return <Button onClick={handleLogin}>{buttonText}</Button>;
};

export default Login;
