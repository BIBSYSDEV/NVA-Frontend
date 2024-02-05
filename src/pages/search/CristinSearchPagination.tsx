import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { ListPagination } from '../../components/ListPagination';
import { SearchParam } from '../../utils/searchHelpers';

interface CristinSearchPaginationProps {
  children: ReactNode;
  totalCount: number;
  page: number;
  rowsPerPage: number;
}

export const CristinSearchPagination = ({ children, totalCount, page, rowsPerPage }: CristinSearchPaginationProps) => {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const updatePath = (page: string, results: string) => {
    params.set(SearchParam.Page, page);
    params.set(SearchParam.Results, results);
    history.push({ search: params.toString() });
  };

  return (
    <ListPagination
      count={totalCount}
      page={page}
      onPageChange={(newPage) => updatePath(newPage.toString(), rowsPerPage.toString())}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(newRowsPerPage) => updatePath('1', newRowsPerPage.toString())}
      showPaginationTop={true}>
      {children}
    </ListPagination>
  );
};
