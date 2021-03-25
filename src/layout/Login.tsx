import { useAuthentication } from '../utils/hooks/useAuthentication';

const Login = () => {
  const { handleLogin } = useAuthentication();

  handleLogin();

  return null;
};

export default Login;
