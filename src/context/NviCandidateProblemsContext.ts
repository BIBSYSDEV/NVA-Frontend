import { createContext } from 'react';
import { NviCandidateProblem } from '../types/nvi.types';

interface NviCandidateProblemsContextType {
  problems?: NviCandidateProblem[];
}

export const NviCandidateProblemsContext = createContext<NviCandidateProblemsContextType>({
  problems: [],
});
