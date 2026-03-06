import { useLocation } from 'react-router';
import {
  FetchNviCandidatesParams,
  NviCandidateFilter,
  NviCandidateGlobalStatus,
  NviCandidateGlobalStatusEnum,
  NviCandidateOrderBy,
  NviCandidatesSearchParam,
  NviCandidateStatus,
} from '../../api/searchApi';
import { NviCandidateSearchStatus } from '../../types/nvi.types';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';

export const getDefaultNviYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  return currentMonth < 4 ? currentYear - 1 : currentYear;
};

const getCommonNviCandidatesParams = (searchParams: URLSearchParams) => {
  const affiliations = searchParams.get(NviCandidatesSearchParam.Affiliations)?.split(',');
  const assignee = searchParams.get(NviCandidatesSearchParam.Assignee);
  const excludeSubUnits = searchParams.get(NviCandidatesSearchParam.ExcludeSubUnits) === 'true';
  const filter = searchParams.get(NviCandidatesSearchParam.Filter) as NviCandidateFilter | null;
  const offsetParam = searchParams.get(NviCandidatesSearchParam.Offset);
  const offset = offsetParam ? Number(offsetParam) : 0;
  const orderBy = searchParams.get(NviCandidatesSearchParam.OrderBy) as NviCandidateOrderBy | null;
  const query = searchParams.get(NviCandidatesSearchParam.Query);
  const sizeParam = searchParams.get(NviCandidatesSearchParam.Size);
  const size = sizeParam ? Number(sizeParam) : ROWS_PER_PAGE_OPTIONS[0];
  const sortOrder = searchParams.get(NviCandidatesSearchParam.SortOrder) as 'asc' | 'desc' | null;

  return { affiliations, assignee, excludeSubUnits, filter, offset, orderBy, query, size, sortOrder };
};

export const useNviCandidatesParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const commonValues = getCommonNviCandidatesParams(searchParams);

  const aggregation = searchParams.get(NviCandidatesSearchParam.Aggregation) as 'all' | NviCandidateSearchStatus | null;
  const status = searchParams.get(NviCandidatesSearchParam.Status)?.split(',') as NviCandidateStatus[] | null;
  const globalStatus = searchParams.get(NviCandidatesSearchParam.GlobalStatus)?.split(',') as
    | NviCandidateGlobalStatus[]
    | null;
  const sortOrder = searchParams.get(NviCandidatesSearchParam.SortOrder) as 'asc' | 'desc' | null;
  const year = (searchParams.get(NviCandidatesSearchParam.Year) as number | null) ?? getDefaultNviYear();
  const excludeUnassigned = searchParams.get(NviCandidatesSearchParam.ExcludeUnassigned) === 'true';
  const excludeEmptyRows = searchParams.get(NviCandidatesSearchParam.ExcludeEmptyRows) === 'true';

  return {
    ...commonValues,
    aggregation,
    excludeUnassigned,
    globalStatus,
    sortOrder,
    status,
    year,
    excludeEmptyRows,
  } satisfies FetchNviCandidatesParams;
};

export const useNviDisputeParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const commonValues = getCommonNviCandidatesParams(searchParams);

  const globalStatus = [NviCandidateGlobalStatusEnum.Dispute];
  const year = getDefaultNviYear();

  return {
    ...commonValues,
    globalStatus,
    year,
  } satisfies FetchNviCandidatesParams;
};
