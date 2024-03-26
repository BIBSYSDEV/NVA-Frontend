import { Box, MenuItem, Pagination, PaginationItem, Select, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ROWS_PER_PAGE_OPTIONS } from '../utils/constants';
import { dataTestId } from '../utils/dataTestIds';

export interface ListPaginationBottomProps {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  maxHits?: number; // Default limit of 10_000 hits in ElasticSearch
  pageCounterComponent: ReactNode;
}

export const ListPaginationBottom = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
  maxHits,
  pageCounterComponent,
}: ListPaginationBottomProps) => {
  const { t } = useTranslation();

  const maxPages = maxHits ? Math.ceil(maxHits / rowsPerPage) : Infinity;
  const totalPages = Math.ceil(count / rowsPerPage);
  const pages = Math.min(maxPages, totalPages);

  return (
    <Box
      sx={{
        mx: { xs: '0.25rem', md: '0' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' },
        gap: '0.25rem 0.5rem',
        alignItems: 'center',
        justifyItems: 'center',
      }}
      data-testid={dataTestId.common.pagination}>
      {pageCounterComponent}

      <Pagination
        sx={{
          '.MuiPagination-ul': {
            justifyContent: 'center',
          },
        }}
        page={page}
        count={pages}
        onChange={(_, newPage) => onPageChange(newPage)}
        renderItem={(item) => (
          <PaginationItem {...item} variant={item.selected ? 'outlined' : 'text'} page={item.page?.toLocaleString()} />
        )}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Typography component="label">{t('common.pagination_rows_per_page')}</Typography>
        <Select
          inputProps={{
            'aria-label': t('common.pagination_rows_per_page'),
          }}
          sx={{
            '.MuiSelect-select': {
              py: '0.3rem',
            },
          }}
          variant="outlined"
          size="small"
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(+event.target.value)}>
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};
