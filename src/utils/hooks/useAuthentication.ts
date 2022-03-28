import { useDispatch } from 'react-redux';
import { Auth } from '@aws-amplify/auth';
import { USE_MOCK_DATA, LocalStorageKey } from '../constants';
import { setUser } from '../../redux/actions/userActions';
import { mockUser } from '../testfiles/mock_feide_user';
import { logoutSuccess } from '../../redux/actions/authActions';
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
      await Auth.signOut();
    }
  };

  return { handleLogin, handleLogout };
};
