import { createContext } from 'react';

interface NviCandidateContextType {
  disableNviCriticalFields: boolean;
  disableChannelClaimsFields: boolean;
}

export const NviCandidateContext = createContext<NviCandidateContextType>({
  disableNviCriticalFields: false,
  disableChannelClaimsFields: false,
});
