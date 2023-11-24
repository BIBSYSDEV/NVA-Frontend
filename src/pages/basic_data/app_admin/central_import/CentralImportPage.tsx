import { Box, List, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FetchImportCandidatesParams, SortOrder, fetchImportCandidates } from '../../../../api/searchApi';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { SearchForm } from '../../../../components/SearchForm';
import { SortSelector } from '../../../../components/SortSelector';
import { ImportCandidateStatus } from '../../../../types/importCandidate.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { SearchParam } from '../../../../utils/searchHelpers';
import { CandidateStatusFilter } from '../../BasicDataPage';
import { CentralImportResultItem } from './CentralImportResultItem';

interface CentralImportPageProps {
  statusFilter: CandidateStatusFilter;
  yearFilter: number;
}

export const CentralImportPage = ({ statusFilter, yearFilter }: CentralImportPageProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);
  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[0];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const queryValue: ImportCandidateStatus = statusFilter.NOT_IMPORTED
    ? 'NOT_IMPORTED'
    : statusFilter.IMPORTED
      ? 'IMPORTED'
      : 'NOT_APPLICABLE';

  const query = [`importStatus.candidateStatus:${queryValue}`, `publicationYear:${yearFilter}`, params.get('query')]
    .filter(Boolean)
    .join(' AND ');

  const importCandidateQueryParams: FetchImportCandidatesParams = {
    query,
    orderBy: params.get(SearchParam.OrderBy) ?? 'createdDate',
    sortOrder: (params.get(SearchParam.SortOrder) as SortOrder | null) ?? 'desc',
  };

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidates', rowsPerPage, page, importCandidateQueryParams],
    queryFn: () => fetchImportCandidates(rowsPerPage, page * rowsPerPage, importCandidateQueryParams),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
  });

  const updatePath = (from: string, results: string) => {
    params.set(SearchParam.From, from);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  useEffect(() => {
    if (importCandidateQuery.data?.hits.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [importCandidateQuery.data?.hits]);

  const searchResults = importCandidateQuery.data?.hits ?? [];

  return (
    <section>
      <Box sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr auto' }}>
        <SearchForm placeholder={t('tasks.search_placeholder')} />
        <SortSelector
          sx={{ minWidth: '15rem' }}
          options={[
            { orderBy: 'createdDate', sortOrder: 'desc', label: t('basic_data.central_import.sort_newest_first') },
            { orderBy: 'createdDate', sortOrder: 'asc', label: t('basic_data.central_import.sort_oldest_first') },
            {
              orderBy: 'importStatus.modifiedDate',
              sortOrder: 'desc',
              label: t('search.sort_by_modified_date'),
            },
          ]}
        />
      </Box>
      {importCandidateQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : searchResults.length > 0 ? (
        <>
          <List>
            {searchResults.map((importCandidate) => (
              <ErrorBoundary key={importCandidate.id}>
                <CentralImportResultItem importCandidate={importCandidate} />
              </ErrorBoundary>
            ))}
          </List>
          <ListPagination
            count={importCandidateQuery.data?.size ?? 0}
            rowsPerPage={rowsPerPage}
            page={page + 1}
            onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
            onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
          />
        </>
      ) : (
        <Typography sx={{ mt: '1rem' }}>{t('common.no_hits')}</Typography>
      )}
    </section>
  );
};
