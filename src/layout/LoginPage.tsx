import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { PreviousPathLocationState } from '../types/locationState.types';
import { LocalStorageKey } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../utils/urlPaths';

const LoginPage = () => {
  const user = useSelector((store: RootState) => store.user);
  const location = useLocation<PreviousPathLocationState>();
  const { handleLogin } = useAuthentication();

  if (user) {
    return <Redirect to={UrlPathTemplate.Home} />;
  }

  const redirectPath = location.state?.previousPath ?? UrlPathTemplate.Home;

  localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
  handleLogin();
  return null;
};

export default LoginPage;
