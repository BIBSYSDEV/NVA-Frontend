import { Divider, List, TablePagination, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../../../utils/hooks/useFetch';
import { Registration } from '../../../types/registration.types';
import { SearchApiPath } from '../../../api/apiPaths';
import { SearchResponse } from '../../../types/common.types';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { CentralImportResultItem } from './CentralImportResultItem';
import { dataTestId } from '../../../utils/dataTestIds';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { SearchParam } from '../../../utils/searchHelpers';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

export const CentralImportPage = () => {
  const { t } = useTranslation('basicData');
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);
  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[1];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const [searchResults, isLoadingSearchResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?${params.toString()}`,
    errorMessage: t('feedback:error.search'),
  });

  const updatePath = (from: string, results: string) => {
    params.set(SearchParam.From, from);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  const publications = searchResults?.hits ?? [];

  useEffect(() => {
    if (searchResults?.hits.some(({ entityDescription }) => stringIncludesMathJax(entityDescription?.mainTitle))) {
      typesetMathJax();
    }
  }, [searchResults]);

  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('publications')}
      </Typography>
      {isLoadingSearchResults ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        searchResults && (
          <>
            <Typography variant="subtitle1">{t('search:hits', { count: searchResults.size })}:</Typography>
            <Divider />
            <List>
              {publications.map((publication, index) => (
                <CentralImportResultItem publication={publication} key={publication.identifier + index} />
              ))}
            </List>
            {publications.length > 0 && (
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
