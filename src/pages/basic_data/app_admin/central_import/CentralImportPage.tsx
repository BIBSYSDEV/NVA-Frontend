import { List } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchImportCandidates } from '../../../../api/searchApi';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { ImportCandidateStatus } from '../../../../types/importCandidate.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../../utils/constants';
import { stringIncludesMathJax, typesetMathJax } from '../../../../utils/mathJaxHelpers';
import { SearchParam } from '../../../../utils/searchHelpers';
import { CandidateStatusFilter } from '../../BasicDataPage';
import { CentralImportResultItem } from './CentralImportResultItem';

interface CentralImportPageProps {
  filter: CandidateStatusFilter;
}

export const CentralImportPage = ({ filter }: CentralImportPageProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);
  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[0];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const queryValue: ImportCandidateStatus = filter.NOT_IMPORTED
    ? 'NOT_IMPORTED'
    : filter.IMPORTED
    ? 'IMPORTED'
    : 'NOT_APPLICABLE';
  const query = `importStatus.candidateStatus=${queryValue}`;

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidates', rowsPerPage, page, query],
    queryFn: () => fetchImportCandidates(rowsPerPage, page * rowsPerPage, query),
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
    <section>
      {importCandidateQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          <List>
            {searchResults.map((importCandidate) => (
              <CentralImportResultItem importCandidate={importCandidate} key={importCandidate.id} />
            ))}
          </List>
          {searchResults.length > 0 && (
            <ListPagination
              count={importCandidateQuery.data?.size ?? -1}
              rowsPerPage={rowsPerPage}
              page={page + 1}
              onPageChange={(newPage) => updatePath(((newPage - 1) * rowsPerPage).toString(), rowsPerPage.toString())}
              onRowsPerPageChange={(newRowsPerPage) => updatePath('0', newRowsPerPage.toString())}
            />
          )}
        </>
      )}
    </section>
  );
};
