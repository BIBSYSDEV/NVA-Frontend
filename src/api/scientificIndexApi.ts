import { Note, NviCandidate } from '../types/nvi.types';
import { ScientificIndexApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export const createNote = async (candidateIdentifier: string, note: Pick<Note, 'text'>) => {
  const createNoteResponse = await authenticatedApiRequest2<NviCandidate>({
    url: `${ScientificIndexApiPath.Candidate}/${candidateIdentifier}/note`,
    method: 'POST',
    data: note,
  });

  return createNoteResponse.data;
};
