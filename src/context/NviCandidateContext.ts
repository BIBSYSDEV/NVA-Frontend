import { createContext } from 'react';
import { NviCandidate } from '../types/nvi.types';

interface NviCandidateContextType {
  nviCandiadate?: NviCandidate;
  isApprovedNviCandidate: boolean;
}

export const NviCandidateContext = createContext<NviCandidateContextType>({
  nviCandiadate: undefined,
  isApprovedNviCandidate: false,
});
