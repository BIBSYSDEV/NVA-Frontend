import { useHistory } from 'react-router-dom';
import { ListPagination } from '../../components/ListPagination';
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

  const rowsPerPage = resultsParam ? +resultsParam : ROWS_PER_PAGE_OPTIONS[0];

  const updatePath = (page: string, results: string) => {
    params.set(SearchParam.Page, page);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  return (
    <ListPagination
      count={totalCount}
      page={pageParam ? +pageParam : 1}
      onPageChange={(newPage) => updatePath(newPage.toString(), rowsPerPage.toString())}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(newRowsPerPage) => updatePath('1', newRowsPerPage.toString())}
      dataTestId={dataTestId.startPage.searchPagination}
    />
  );
};
