import { Box } from '@mui/material';
import { ReactNode, useRef } from 'react';
import { ListPaginationBottom, ListPaginationBottomProps } from './ListPaginationBottom';
import { ListPaginationCounter } from './ListPaginationCounter';
import { ListPaginationTop } from './ListPaginationTop';

interface ListPaginationProps extends Omit<ListPaginationBottomProps, 'pageCounterComponent' | 'scrollToDivRef'> {
  children: ReactNode;
  showPaginationTop?: boolean;
  sortingComponent?: ReactNode;
  alternativePaginationText?: string;
  paginationAriaLabel?: string;
}

export const ListPagination = ({
  children,
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  sortingComponent,
  showPaginationTop = !!sortingComponent,
  maxHits,
  rowsPerPageOptions,
  alternativePaginationText,
  paginationAriaLabel,
}: ListPaginationProps) => {
  const itemsStart = count > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const itemsEnd = Math.min(page * rowsPerPage, count);
  const pageCounter = <ListPaginationCounter start={itemsStart} end={itemsEnd} total={count} />;
  const scrollToDivRef = useRef<HTMLDivElement>(null);

  if (count === 0) {
    return children;
  }

  return (
    <>
      <Box ref={scrollToDivRef} sx={{ scrollMarginTop: '5rem' }} />
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
        rowsPerPageOptions={rowsPerPageOptions}
        alternativePaginationText={alternativePaginationText}
        paginationAriaLabel={paginationAriaLabel}
        scrollToDivRef={scrollToDivRef}
      />
    </>
  );
};
