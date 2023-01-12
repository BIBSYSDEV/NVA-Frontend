import { TablePagination } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchParam } from '../../utils/searchHelpers';

interface SearchListPagingProps {
  totalCount: number;
}

export const SearchListPaging = ({ totalCount }: SearchListPagingProps) => {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const resultsParam = params.get(SearchParam.Results);
  const fromParam = params.get(SearchParam.From);

  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[1];
  const page = (fromParam && resultsParam && Math.floor(+fromParam / rowsPerPage)) || 0;

  const updatePath = (from: string, results: string) => {
    params.set(SearchParam.From, from);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  return (
    <TablePagination
      data-testid={dataTestId.startPage.searchPagination}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      component="div"
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(_, newPage) => updatePath((newPage * rowsPerPage).toString(), rowsPerPage.toString())}
      onRowsPerPageChange={(event) => updatePath('0', event.target.value)}
    />
  );
};
