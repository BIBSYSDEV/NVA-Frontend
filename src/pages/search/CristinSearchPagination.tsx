import { TablePagination } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchParam } from '../../utils/searchHelpers';

interface CristinSearchPaginationProps {
  totalCount: number;
}

export const CristinSearchPagination = ({ totalCount }: CristinSearchPaginationProps) => {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const resultsParam = params.get(SearchParam.Results);
  const pageParam = params.get(SearchParam.Page);
  const muiPage = pageParam ? +pageParam - 1 : 0;

  const rowsPerPage = (resultsParam && +resultsParam) || ROWS_PER_PAGE_OPTIONS[1];

  const updatePath = (page: string, results: string) => {
    params.set(SearchParam.Page, page);
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
      page={muiPage}
      onPageChange={(_, newMuiPage) => updatePath((newMuiPage + 1).toString(), rowsPerPage.toString())}
      onRowsPerPageChange={(event) => updatePath('1', event.target.value)}
    />
  );
};
