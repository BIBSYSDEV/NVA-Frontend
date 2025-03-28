import { useLocation } from 'react-router';
import { ImportCandidateOrderBy, ImportCandidatesSearchParam, SortOrder } from '../../api/searchApi';
import { CollaborationType, ImportCandidateStatus } from '../../types/importCandidate.types';
import { AggregationFileKeyType, PublicationInstanceType } from '../../types/registration.types';

export const useImportCandidatesParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const aggregationParam = searchParams.get(ImportCandidatesSearchParam.Aggregation);
  const collaborationTypeParam = searchParams.get(
    ImportCandidatesSearchParam.CollaborationType
  ) as CollaborationType | null;
  const filesParam = searchParams.get(ImportCandidatesSearchParam.Files) as AggregationFileKeyType | null;
  const fromParam = searchParams.get(ImportCandidatesSearchParam.From) as number | null;
  const importStatusParam = searchParams.get(ImportCandidatesSearchParam.ImportStatus) as ImportCandidateStatus | null;
  const orderByParam = searchParams.get(ImportCandidatesSearchParam.OrderBy) as ImportCandidateOrderBy | null;
  const publicationYearParam = searchParams.get(ImportCandidatesSearchParam.PublicationYear) as number | null;
  const queryParam = searchParams.get(ImportCandidatesSearchParam.Query);
  const sizeParam = searchParams.get(ImportCandidatesSearchParam.Size) as number | null;
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
