import { useLocation } from 'react-router-dom';
import { ImportCandidatesSearchParam } from '../../api/searchApi';
import { ImportCandidateStatus } from '../../types/importCandidate.types';

export const useImportCandidatesParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const importStatusParam = searchParams.get(ImportCandidatesSearchParam.ImportStatus) as ImportCandidateStatus | null;

  const publicationYearValue = searchParams.get(ImportCandidatesSearchParam.PublicationYear);
  const publicationYearParam = publicationYearValue ? +publicationYearValue : null;

  return { importStatusParam, publicationYearParam };
};
