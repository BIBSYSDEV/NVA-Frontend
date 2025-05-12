import { createContext } from 'react';

interface ChannelClaimContextProps {
  refetchData: () => Promise<void>;
}

export const ChannelClaimContext = createContext<ChannelClaimContextProps>({
  refetchData: async () => {},
});
