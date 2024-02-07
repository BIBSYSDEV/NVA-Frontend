import { Box } from '@mui/material';
import { ListPaginationCounter } from './ListPaginationCounter';

interface ListPaginationTopProps {
  count: number;
  rowsPerPage: number;
  page: number;
}

export const ListPaginationTop = ({ count, rowsPerPage, page }: ListPaginationTopProps) => {
  const itemsStart = count > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const itemsEnd = Math.min(page * rowsPerPage, count);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', mx: { xs: '0.5rem', md: 0 } }}>
      <ListPaginationCounter start={itemsStart} end={itemsEnd} total={count} />
    </Box>
  );
};
