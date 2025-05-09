import { ClaimedChannel } from '../types/customerInstitution.types';

export const filterChannelClaims = (channelClaimList: ClaimedChannel[], customerId: string): ClaimedChannel[] => {
  return channelClaimList.filter((claim) => claim.claimedBy.id === customerId);
};
