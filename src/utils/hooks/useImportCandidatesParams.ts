import { useLocation } from 'react-router';
import { ImportCandidateOrderBy, ImportCandidatesSearchParam, SortOrder } from '../../api/searchApi';
import { CollaborationType, ImportCandidateStatus } from '../../types/importCandidate.types';
import { AggregationFileKeyType, PublicationInstanceType } from '../../types/registration.types';
import { parseNumericParam } from '../url-param-helpers';

export const useImportCandidatesParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const aggregationParam = searchParams.get(ImportCandidatesSearchParam.Aggregation);
  const collaborationTypeParam = searchParams.get(
    ImportCandidatesSearchParam.CollaborationType
  ) as CollaborationType | null;
  const filesParam = searchParams.get(ImportCandidatesSearchParam.Files) as AggregationFileKeyType | null;
  const fromParam = parseNumericParam(searchParams.get(ImportCandidatesSearchParam.From), null);
  const importStatusParam = searchParams.get(ImportCandidatesSearchParam.ImportStatus) as ImportCandidateStatus | null;
  const orderByParam = searchParams.get(ImportCandidatesSearchParam.OrderBy) as ImportCandidateOrderBy | null;
  const publicationYearParam = parseNumericParam(searchParams.get(ImportCandidatesSearchParam.PublicationYear), null);
  const queryParam = searchParams.get(ImportCandidatesSearchParam.Query);
  const sizeParam = parseNumericParam(searchParams.get(ImportCandidatesSearchParam.Size), null);
  const sortOrderParam = searchParams.get(ImportCandidatesSearchParam.SortOrder) as SortOrder | null;
  const topLevelOrganizationParam = searchParams.get(ImportCandidatesSearchParam.TopLevelOrganization);
  const typeParam = searchParams.get(ImportCandidatesSearchParam.Type) as PublicationInstanceType | null;

  return {
    aggregationParam,
    collaborationTypeParam,
    filesParam,
    fromParam,
    importStatusParam,
    orderByParam,
    publicationYearParam,
    queryParam,
    sizeParam,
    sortOrderParam,
    topLevelOrganizationParam,
    typeParam,
  };
};
