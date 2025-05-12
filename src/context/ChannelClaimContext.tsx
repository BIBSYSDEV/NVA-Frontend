import { createContext } from 'react';

interface ChannelClaimContextProps {
  refetchClaimedChannels: () => Promise<unknown>;
}

export const ChannelClaimContext = createContext<ChannelClaimContextProps>({
  refetchClaimedChannels: async () => {},
});
