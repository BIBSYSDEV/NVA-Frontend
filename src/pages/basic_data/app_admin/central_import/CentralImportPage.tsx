import { List, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ImportCandidatesSearchParam } from '../../../../api/searchApi';
import { DocumentHeadTitle } from '../../../../components/DocumentHeadTitle';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { SearchForm } from '../../../../components/SearchForm';
import { SortSelector } from '../../../../components/SortSelector';
import { useFetchImportCandidatesQuery } from '../../../../utils/hooks/useFetchImportCandidatesQuery';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { syncParamsWithSearchFields } from '../../../../utils/searchHelpers';
import { CentralImportResultItem } from './CentralImportResultItem';

export const CentralImportPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { importCandidateQuery, importCandidateParams } = useFetchImportCandidatesQuery();

  const updatePath = (from: string, results: string) => {
    const syncedParams = syncParamsWithSearchFields(params);
    syncedParams.set(ImportCandidatesSearchParam.From, from);
    syncedParams.set(ImportCandidatesSearchParam.Size, results);
    navigate({ search: syncedParams.toString() });
  };

  useEffect(() => {
    if (importCandidateQuery.data?.hits.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [importCandidateQuery.data?.hits]);

  const searchResults = importCandidateQuery.data?.hits ?? [];

  return (
    <section>
      <DocumentHeadTitle>{t('basic_data.central_import.central_import')}</DocumentHeadTitle>

      <SearchForm sx={{ mb: '1rem' }} placeholder={t('tasks.search_placeholder')} />

      {importCandidateQuery.isPending ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : searchResults.length > 0 ? (
        <ListPagination
          count={importCandidateQuery.data?.totalHits ?? 0}
          rowsPerPage={importCandidateParams.size}
          page={Math.floor(importCandidateParams.from / importCandidateParams.size) + 1}
          onPageChange={(newPage) =>
            updatePath(((newPage - 1) * importCandidateParams.size).toString(), importCandidateParams.size.toString())
          }
          onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
          showPaginationTop
          sortingComponent={
            <SortSelector
              sortKey={ImportCandidatesSearchParam.SortOrder}
              orderKey={ImportCandidatesSearchParam.OrderBy}
              paginationKey={ImportCandidatesSearchParam.From}
              aria-label={t('search.sort_by')}
              size="small"
              variant="standard"
              options={[
                {
                  orderBy: 'createdDate',
                  sortOrder: 'desc',
                  i18nKey: 'basic_data.central_import.sort_newest_first',
                },
                { orderBy: 'createdDate', sortOrder: 'asc', i18nKey: 'basic_data.central_import.sort_oldest_first' },
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
