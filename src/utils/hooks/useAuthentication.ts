import { signInWithRedirect, signOut } from 'aws-amplify/auth';
import { useDispatch } from 'react-redux';
import { logoutSuccess, setUser } from '../../redux/userSlice';
import { LocalStorageKey, USE_MOCK_DATA } from '../constants';
import { getCurrentPath } from '../general-helpers';
import { mockUser } from '../testfiles/mock_feide_user';
import { UrlPathTemplate } from '../urlPaths';

interface UseAuthentication {
  handleLogin: () => void;
  handleLogout: () => void;
}

export const useAuthentication = (): UseAuthentication => {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      try {
        await signInWithRedirect({ provider: { custom: 'Dataporten' } });
      } catch (error: any) {
        if (error?.name === 'UserAlreadyAuthenticatedException') {
          window.location.reload();
        }
      }
    }
  };

  const handleLogout = async () => {
    localStorage.setItem(LocalStorageKey.RedirectPath, getCurrentPath());
    if (USE_MOCK_DATA) {
      dispatch(logoutSuccess());
      window.location.pathname = UrlPathTemplate.Logout;
    } else {
      await signOut({ global: true });
    }
  };

  return { handleLogin, handleLogout };
};
