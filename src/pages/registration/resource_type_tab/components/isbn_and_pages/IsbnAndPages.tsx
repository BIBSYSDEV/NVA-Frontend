import { Box } from '@mui/material';
import { IsbnField } from './IsbnField';
import { TotalPagesField } from './TotalPagesField';

export const IsbnAndPages = () => (
  <Box
    sx={{
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    }}>
    <IsbnField />
    <TotalPagesField />
  </Box>
);
