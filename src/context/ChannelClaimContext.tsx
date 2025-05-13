import { createContext } from 'react';
import { ChannelClaimType } from '../types/customerInstitution.types';

interface ChannelClaimContextProps {
  refetchClaimedChannels: () => Promise<unknown>;
  channelType: ChannelClaimType;
}

export const ChannelClaimContext = createContext<ChannelClaimContextProps>({
  refetchClaimedChannels: async () => {},
  channelType: undefined as unknown as ChannelClaimType,
});
