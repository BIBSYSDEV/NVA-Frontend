import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

/**
 * React hook that retrieves the logged-in user's top organization Cristin ID and customer ID from the Redux store.
 * @returns An object containing `topOrgCristinId` and `customerId` for the current logged in user.
 */
export const useLoggedInUser = () => {
  const user = useSelector((store: RootState) => store.user);

  return { topOrgCristinId: user?.topOrgCristinId ?? '', customerId: user?.customerId ?? '' };
};
