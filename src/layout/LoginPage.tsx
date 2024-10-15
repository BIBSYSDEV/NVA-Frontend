import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { PreviousPathLocationState } from '../types/locationState.types';
import { LocalStorageKey } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../utils/urlPaths';

const LoginPage = () => {
  const user = useSelector((store: RootState) => store.user);
  const location = useLocation();
  const { handleLogin } = useAuthentication();

  if (user) {
    return <Navigate to={UrlPathTemplate.Root} />;
  }

  const locationState = location.state as PreviousPathLocationState | undefined;
  const redirectPath = locationState?.previousPath ?? UrlPathTemplate.Root;

  localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
  handleLogin();
  return null;
};

export default LoginPage;
