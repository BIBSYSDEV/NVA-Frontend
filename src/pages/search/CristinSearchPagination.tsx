import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListPagination } from '../../components/ListPagination';
import { SearchParam } from '../../utils/searchHelpers';

interface CristinSearchPaginationProps {
  children: ReactNode;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  sortingComponent?: ReactNode;
}

export const CristinSearchPagination = ({
  children,
  totalCount,
  page,
  rowsPerPage,
  sortingComponent,
}: CristinSearchPaginationProps) => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const updatePath = (page: string, results: string) => {
    params.set(SearchParam.Page, page);
    params.set(SearchParam.Results, results);
    navigate({ search: params.toString() });
  };

  return (
    <ListPagination
      count={totalCount}
      page={page}
      onPageChange={(newPage) => updatePath(newPage.toString(), rowsPerPage.toString())}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(newRowsPerPage) => updatePath('1', newRowsPerPage.toString())}
      showPaginationTop
      sortingComponent={sortingComponent}>
      {children}
    </ListPagination>
  );
};
