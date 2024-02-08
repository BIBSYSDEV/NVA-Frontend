import { ReactNode } from 'react';
import { ListPaginationBottom } from './ListPaginationBottom';
import { ListPaginationCounter } from './ListPaginationCounter';
import { ListPaginationTop } from './ListPaginationTop';

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
  sortingComponent?: ReactNode;
}

export const ListPagination = ({
  children,
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  showPaginationTop,
  sortingComponent,
}: ListPaginationProps) => {
  const itemsStart = count > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const itemsEnd = Math.min(page * rowsPerPage, count);
  const pageCounter = <ListPaginationCounter start={itemsStart} end={itemsEnd} total={count} />;

  return (
    <>
      {showPaginationTop && (
        <ListPaginationTop pageCounterComponent={pageCounter} sortingComponent={sortingComponent} />
      )}
      {children}
      <ListPaginationBottom
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        pageCounterComponent={pageCounter}
      />
    </>
  );
};
