import { createContext } from 'react';
import { NviCandidate } from '../types/nvi.types';

interface NviCandidateContextType {
  nviCandiadate?: NviCandidate;
  disableNviCriticalFields: boolean;
}

export const NviCandidateContext = createContext<NviCandidateContextType>({
  nviCandiadate: undefined,
  disableNviCriticalFields: false,
});
