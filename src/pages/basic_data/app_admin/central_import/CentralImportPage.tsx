import { List, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  FetchImportCandidatesParams,
  ImportCandidatesSearchParam,
  fetchImportCandidates,
} from '../../../../api/searchApi';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { SearchForm } from '../../../../components/SearchForm';
import { SortSelector } from '../../../../components/SortSelector';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { useImportCandidatesParams } from '../../../../utils/hooks/useImportCandidatesParams';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { CentralImportResultItem } from './CentralImportResultItem';

const thisYear = new Date().getFullYear();

export const CentralImportPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const importCandidateParams = useImportCandidatesParams();

  const sizeParam = importCandidateParams.sizeParam ?? ROWS_PER_PAGE_OPTIONS[0];
  const fromParam = importCandidateParams.fromParam ?? 0;

  const importCandidateQueryParams: FetchImportCandidatesParams = {
    query: importCandidateParams.queryParam,
    publicationYear: importCandidateParams.publicationYearParam ?? thisYear,
    importStatus: importCandidateParams.importStatusParam ?? 'NOT_IMPORTED',
    orderBy: importCandidateParams.orderByParam ?? 'createdDate',
    sortOrder: importCandidateParams.sortOrderParam ?? 'desc',
    type: importCandidateParams.typeParam,
    size: sizeParam,
    from: fromParam,
  };
  const importCandidateQuery = useQuery({
    queryKey: ['importCandidates', importCandidateQueryParams],
    queryFn: () => fetchImportCandidates(importCandidateQueryParams),
    meta: { errorMessage: t('feedback.error.get_import_candidates') },
  });

  const updatePath = (from: string, results: string) => {
    params.set(ImportCandidatesSearchParam.From, from);
    params.set(ImportCandidatesSearchParam.Size, results);
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
      <Helmet>
        <title>{t('basic_data.central_import.central_import')}</title>
      </Helmet>
      <SearchForm sx={{ mb: '1rem' }} placeholder={t('tasks.search_placeholder')} />

      {importCandidateQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : searchResults.length > 0 ? (
        <ListPagination
          count={importCandidateQuery.data?.totalHits ?? 0}
          rowsPerPage={sizeParam}
          page={Math.floor(fromParam / sizeParam) + 1}
          onPageChange={(newPage) => updatePath(((newPage - 1) * sizeParam).toString(), sizeParam.toString())}
          onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
          showPaginationTop
          sortingComponent={
            <SortSelector
              sortKey={ImportCandidatesSearchParam.SortOrder}
              orderKey={ImportCandidatesSearchParam.OrderBy}
              aria-label={t('search.sort_by')}
              size="small"
              variant="standard"
              options={[
                { orderBy: 'createdDate', sortOrder: 'desc', label: t('basic_data.central_import.sort_newest_first') },
                { orderBy: 'createdDate', sortOrder: 'asc', label: t('basic_data.central_import.sort_oldest_first') },
              ]}
            />
          }>
          <List>
            {searchResults.map((importCandidate) => (
              <ErrorBoundary key={importCandidate.id}>
                <CentralImportResultItem importCandidate={importCandidate} />
              </ErrorBoundary>
            ))}
          </List>
        </ListPagination>
      ) : (
        <Typography sx={{ mt: '1rem' }}>{t('common.no_hits')}</Typography>
      )}
    </section>
  );
};
