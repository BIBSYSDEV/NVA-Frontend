import { createContext } from 'react';

interface NviCandidateContextType {
  disableNviCriticalFields: boolean;
}

export const NviCandidateContext = createContext<NviCandidateContextType>({
  disableNviCriticalFields: false,
});
