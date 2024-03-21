import { ReactNode } from 'react';
import { ListPaginationBottom, ListPaginationBottomProps } from './ListPaginationBottom';
import { ListPaginationCounter } from './ListPaginationCounter';
import { ListPaginationTop } from './ListPaginationTop';

interface ListPaginationProps extends Omit<ListPaginationBottomProps, 'pageCounterComponent'> {
  children: ReactNode;
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
  maxHits,
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
        maxHits={maxHits}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        pageCounterComponent={pageCounter}
      />
    </>
  );
};
