import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ListPaginationTopProps {
  count: number;
  rowsPerPage: number;
  page: number;
}

export const ListPaginationTop = ({ count, rowsPerPage, page }: ListPaginationTopProps) => {
  const { t } = useTranslation();

  const itemsStart = count > 0 ? ((page - 1) * rowsPerPage + 1).toLocaleString() : '0';
  const itemsEnd = Math.min(page * rowsPerPage, count).toLocaleString();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
      <Typography aria-live="polite">
        {t('common.pagination_showing_interval', {
          start: itemsStart,
          end: itemsEnd,
          total: count.toLocaleString(),
        })}
      </Typography>
    </Box>
  );
};
