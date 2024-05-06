import { useLocation } from 'react-router-dom';
import { ImportCandidateOrderBy, ImportCandidatesSearchParam, SortOrder } from '../../api/searchApi';
import { ImportCandidateStatus } from '../../types/importCandidate.types';

export const useImportCandidatesParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const aggregationParam = searchParams.get(ImportCandidatesSearchParam.Aggregation);
  const fromParam = searchParams.get(ImportCandidatesSearchParam.From) as number | null;
  const importStatusParam = searchParams.get(ImportCandidatesSearchParam.ImportStatus) as ImportCandidateStatus | null;
  const sizeParam = searchParams.get(ImportCandidatesSearchParam.Size) as number | null;
  const orderByParam = searchParams.get(ImportCandidatesSearchParam.OrderBy) as ImportCandidateOrderBy | null;
  const sortOrderParam = searchParams.get(ImportCandidatesSearchParam.SortOrder) as SortOrder | null;
  const queryParam = searchParams.get(ImportCandidatesSearchParam.Query);
  const publicationYearParam = searchParams.get(ImportCandidatesSearchParam.PublicationYear) as number | null;

  return {
    aggregationParam,
    importStatusParam,
    publicationYearParam,
    sizeParam,
    fromParam,
    orderByParam,
    sortOrderParam,
    queryParam,
  };
};
