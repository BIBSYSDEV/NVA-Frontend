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
  const fromRaw = searchParams.get(ImportCandidatesSearchParam.From);
  const fromParam = fromRaw && Number.isFinite(Number(fromRaw)) ? Number(fromRaw) : null;
  const importStatusParam = searchParams.get(ImportCandidatesSearchParam.ImportStatus) as ImportCandidateStatus | null;
  const orderByParam = searchParams.get(ImportCandidatesSearchParam.OrderBy) as ImportCandidateOrderBy | null;
  const publicationYearRaw = searchParams.get(ImportCandidatesSearchParam.PublicationYear);
  const publicationYearParam =
    publicationYearRaw && Number.isFinite(Number(publicationYearRaw)) ? Number(publicationYearRaw) : null;
  const queryParam = searchParams.get(ImportCandidatesSearchParam.Query);
  const sizeRaw = searchParams.get(ImportCandidatesSearchParam.Size);
  const sizeParam = sizeRaw && Number.isFinite(Number(sizeRaw)) ? Number(sizeRaw) : null;
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
