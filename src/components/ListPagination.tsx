import { ReactNode } from 'react';
import { ListPaginationTop } from './ListPaginationTop';
import { ListPaginationBottom } from './ListPaginationBottom';

interface ListPaginationProps {
  children: ReactNode;
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  maxHits?: number; // Default limit of 10_000 hits in ElasticSearch
  showPaginationTop?: boolean;
}

export const ListPagination = ({
  children,
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  showPaginationTop,
}: ListPaginationProps) => {
  return (
    <>
      {showPaginationTop && <ListPaginationTop count={count} rowsPerPage={rowsPerPage} page={page} />}
      {children}
      <ListPaginationBottom
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};
