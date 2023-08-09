import { Box, MenuItem, Pagination, PaginationItem, Select, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROWS_PER_PAGE_OPTIONS } from '../utils/constants';

interface ListPaginationProps {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  dataTestId?: string;
}

export const ListPagination = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
  dataTestId,
}: ListPaginationProps) => {
  const { t } = useTranslation();

  const totalPages = Math.ceil(count / rowsPerPage);
  const itemsStart = ((page - 1) * rowsPerPage + 1).toLocaleString();
  const itemsEnd = Math.min(page * rowsPerPage, count).toLocaleString();

  return (
    <Box
      sx={{
        my: '0.5rem',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' },
        gap: '0.5rem',
        alignItems: 'center',
        justifyItems: 'center',
      }}
      data-testid={dataTestId}>
      <Typography aria-live="polite">
        {t('common.pagination_showing_interval', { start: itemsStart, end: itemsEnd, total: count.toLocaleString() })}
      </Typography>

      <Pagination
        sx={{
          '.MuiPagination-ul': {
            justifyContent: 'center',
          },
        }}
        page={page}
        count={totalPages}
        onChange={(_, newPage) => onPageChange(newPage)}
        renderItem={(item) => (
          <PaginationItem {...item} variant={item.selected ? 'outlined' : 'text'} page={item.page?.toLocaleString()} />
        )}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Typography>{t('common.pagination_rows_per_page')}</Typography>
        <Select
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
