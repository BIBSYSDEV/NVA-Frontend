import { useLocation } from 'react-router';
import { FetchNviCandidatesParams, NviCandidateOrderBy, NviCandidatesSearchParam } from '../../api/searchApi';
import { NviCandidateSearchStatus } from '../../types/nvi.types';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';

const getDefaultNviYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  return currentMonth < 4 ? currentYear - 1 : currentYear;
};

export const useNviCandidatesParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const affiliations = searchParams.get(NviCandidatesSearchParam.Affiliations)?.split(',') ?? null;
  const aggregation = searchParams.get(NviCandidatesSearchParam.Aggregation) as 'all' | NviCandidateSearchStatus | null;
  const assignee = searchParams.get(NviCandidatesSearchParam.Assignee);
  const excludeSubUnits = searchParams.get(NviCandidatesSearchParam.ExcludeSubUnits) === 'true';
  const filter = (searchParams.get(NviCandidatesSearchParam.Filter) as NviCandidateSearchStatus | null) ?? 'pending';
  const offset = (searchParams.get(NviCandidatesSearchParam.Offset) as number | null) ?? 0;
  const orderBy = searchParams.get(NviCandidatesSearchParam.OrderBy) as NviCandidateOrderBy | null;
  const query = searchParams.get(NviCandidatesSearchParam.Query);
  const size = (searchParams.get(NviCandidatesSearchParam.Size) as number | null) ?? ROWS_PER_PAGE_OPTIONS[0];
  const sortOrder = searchParams.get(NviCandidatesSearchParam.SortOrder) as 'asc' | 'desc' | null;
  const year = (searchParams.get(NviCandidatesSearchParam.Year) as number | null) ?? getDefaultNviYear();
  const visibility = searchParams.get(NviCandidatesSearchParam.Visibility) as NviCandidateSearchStatus | null;

  return {
    affiliations,
    aggregation,
    assignee,
    excludeSubUnits,
    filter,
    offset,
    orderBy,
    query,
    size,
    sortOrder,
    year,
    visibility,
  } satisfies FetchNviCandidatesParams;
};
