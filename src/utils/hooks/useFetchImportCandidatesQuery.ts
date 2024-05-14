import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchImportCandidatesParams, fetchImportCandidates } from '../../api/searchApi';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';
import { useImportCandidatesParams } from './useImportCandidatesParams';

const defaultYearParam = new Date().getFullYear();

export const useFetchImportCandidatesQuery = (enabled = true) => {
  const { t } = useTranslation();
  const importCandidateQueryParams = useImportCandidatesParams();

  const importCandidateParams = {
    aggregation: 'all',
    query: importCandidateQueryParams.queryParam,
    publicationYear: importCandidateQueryParams.publicationYearParam ?? defaultYearParam,
    files: importCandidateQueryParams.filesParam,
    importStatus: importCandidateQueryParams.importStatusParam ?? 'NOT_IMPORTED',
    orderBy: importCandidateQueryParams.orderByParam ?? 'createdDate',
    sortOrder: importCandidateQueryParams.sortOrderParam ?? 'desc',
    topLevelOrganization: importCandidateQueryParams.topLevelOrganizationParam,
    type: importCandidateQueryParams.typeParam,
    collaborationType: importCandidateQueryParams.collaborationTypeParam,
    size: importCandidateQueryParams.sizeParam ?? ROWS_PER_PAGE_OPTIONS[0],
    from: importCandidateQueryParams.fromParam ?? 0,
  } satisfies FetchImportCandidatesParams;

  const importCandidateQuery = useQuery({
    enabled,
    queryKey: ['importCandidates', importCandidateParams],
    queryFn: () => fetchImportCandidates(importCandidateParams),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
    placeholderData: keepPreviousData,
  });

  return { importCandidateQuery, importCandidateParams };
};
