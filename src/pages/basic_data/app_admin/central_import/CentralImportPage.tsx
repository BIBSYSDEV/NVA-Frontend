import { Divider, List, TablePagination, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchImportCandidates } from '../../../../api/searchApi';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { SearchParam } from '../../../../utils/searchHelpers';
import { CentralImportResultItem } from './CentralImportResultItem';

export const CentralImportPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);
  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[1];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;
  const importCandidateQuery = useQuery({
    queryKey: ['importCandidates', rowsPerPage, page, ''],
    queryFn: () => fetchImportCandidates(rowsPerPage, page * rowsPerPage, ''),
    meta: { errorMessage: t('feedback.error.get_registrations') },
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
    <>
      <Typography variant="h3">{t('basic_data.central_import.publications')}</Typography>
      {importCandidateQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            <Typography variant="subtitle1">{t('search.hits', { count: importCandidateQuery.data?.size })}:</Typography>
            <Divider />
            <List>
              {searchResults.map((importCandidate) => (
                <CentralImportResultItem importCandidate={importCandidate} key={importCandidate.id} />
              ))}
            </List>
            {searchResults.length > 0 && (
              <TablePagination
                data-testid={dataTestId.basicData.centralImport.searchPagination}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                component="div"
                count={importCandidateQuery.data?.size ?? -1}
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
