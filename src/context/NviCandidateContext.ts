import { createContext } from 'react';
import { NviCandidate } from '../types/nvi.types';

interface NviCandidateContextType {
  nviCandidate?: NviCandidate;
  disableNviCriticalFields: boolean;
}

export const NviCandidateContext = createContext<NviCandidateContextType>({
  nviCandidate: undefined,
  disableNviCriticalFields: false,
});
