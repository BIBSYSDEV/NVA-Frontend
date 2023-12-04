import { Auth } from '@aws-amplify/auth';
import { useDispatch } from 'react-redux';
import { logoutSuccess, setUser } from '../../redux/userSlice';
import { LocalStorageKey, USE_MOCK_DATA } from '../constants';
import { mockUser } from '../testfiles/mock_feide_user';
import { UrlPathTemplate } from '../urlPaths';

type LoginProvider = 'FeideIdentityProvider' | 'Dataporten';

interface UseAuthentication {
  handleLogin: (loginProvider?: LoginProvider) => void;
  handleLogout: () => void;
}

export const getCurrentPath = () => `${window.location.pathname}${window.location.search}`;

export const useAuthentication = (): UseAuthentication => {
  const dispatch = useDispatch();

  const handleLogin = async (loginProvider: LoginProvider = 'Dataporten') => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      await Auth.federatedSignIn({ customProvider: loginProvider });
    }
  };

  const handleLogout = async () => {
    localStorage.setItem(LocalStorageKey.RedirectPath, getCurrentPath());
    if (USE_MOCK_DATA) {
      dispatch(logoutSuccess());
      window.location.pathname = UrlPathTemplate.Logout;
    } else {
      await Auth.signOut({ global: true });
    }
  };

  return { handleLogin, handleLogout };
};
