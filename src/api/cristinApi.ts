import { FundingSources } from '../types/project.types';
import { CristinApiPath } from './apiPaths';
import { apiRequest2 } from './apiRequest';

export const fetchFundingSources = async () => {
  const getTickets = await apiRequest2<FundingSources>({
    url: CristinApiPath.FundingSources,
  });
  return getTickets.data;
};
