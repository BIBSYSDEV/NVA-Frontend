import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

/**
 * React hook that retrieves the logged-in user from the Redux store.
 * @returns the logged-in user from the Redux store.
 */
export const useLoggedInUser = () => {
  return useSelector((store: RootState) => store.user);
};
