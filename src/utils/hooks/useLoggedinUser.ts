import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

/**
 * React hook that retrieves the logged-in user's top organization Cristin ID and customer ID from the Redux store.
 * @returns An object containing `topOrgCristinId` and `customerId` for the current logged in user.
 */
export const useLoggedinUser = () => {
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId;
  const customerId = user?.customerId ?? '';

  return { topOrgCristinId, customerId };
};
