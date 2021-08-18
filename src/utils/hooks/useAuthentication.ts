import { useDispatch } from 'react-redux';
import { Auth } from 'aws-amplify';
import { USE_MOCK_DATA, FEIDE_IDENTITY_PROVIDER, REDIRECT_PATH_KEY } from '../constants';
import { setUser } from '../../redux/actions/userActions';
import { mockUser } from '../testfiles/mock_feide_user';
import { logoutSuccess } from '../../redux/actions/authActions';

interface UseAuthentication {
  handleLogin: () => void;
  handleLogout: () => void;
}

const getCurrentPath = () => `${window.location.pathname}${window.location.search}`;

export const useAuthentication = (): UseAuthentication => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    localStorage.setItem(REDIRECT_PATH_KEY, getCurrentPath());
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      Auth.federatedSignIn({ customProvider: FEIDE_IDENTITY_PROVIDER });
    }
  };

  const handleLogout = () => {
    localStorage.setItem(REDIRECT_PATH_KEY, getCurrentPath());
    if (USE_MOCK_DATA) {
      dispatch(logoutSuccess());
    } else {
      Auth.signOut();
    }
  };

  return { handleLogin, handleLogout };
};
