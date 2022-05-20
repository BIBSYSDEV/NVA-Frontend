import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { LocalStorageKey } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../utils/urlPaths';

export interface PreviousPathState {
  previousPath?: string;
}

const LoginPage = () => {
  const user = useSelector((store: RootState) => store.user);
  const location = useLocation<PreviousPathState>();
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
