import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, List, TablePagination, Typography } from '@mui/material';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { SearchApiPath } from '../../../../api/apiPaths';
import { SearchResponse } from '../../../../types/common.types';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { CentralImportResultItem } from './CentralImportResultItem';
import { dataTestId } from '../../../../utils/dataTestIds';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { SearchParam } from '../../../../utils/searchHelpers';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { ImportCandidate } from '../../../../types/importCandidate';

export const CentralImportPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);
  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[1];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const [searchResults, isLoadingSearchResults] = useFetch<SearchResponse<ImportCandidate>>({
    url: `${SearchApiPath.ImportCandidates}?${params.toString()}`,
    errorMessage: t('feedback.error.search'),
  });

  const updatePath = (from: string, results: string) => {
    params.set(SearchParam.From, from);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  const importCandidates = searchResults?.hits ?? [];

  useEffect(() => {
    if (searchResults?.hits.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [searchResults]);

  return (
    <>
      <Typography variant="h3">{t('basic_data.central_import.publications')}</Typography>
      {isLoadingSearchResults ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            <Typography variant="subtitle1">{t('search.hits', { count: searchResults.size })}:</Typography>
            <Divider />
            <List>
              {importCandidates.map((publication) => (
                <CentralImportResultItem importCandidate={publication} key={publication.id} />
              ))}
            </List>
            {importCandidates.length > 0 && (
              <TablePagination
                data-testid={dataTestId.basicData.centralImport.searchPagination}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                component="div"
                count={searchResults.size}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => updatePath((newPage * rowsPerPage).toString(), rowsPerPage.toString())}
                onRowsPerPageChange={(event) => updatePath('0', event.target.value)}
              />
            )}
          </>
        )
      )}
    </>
  );
};
