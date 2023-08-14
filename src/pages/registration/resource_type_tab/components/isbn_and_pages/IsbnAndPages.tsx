import { Box } from '@mui/material';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { IsbnField } from './IsbnField';
import { TotalPagesField } from './TotalPagesField';

export const IsbnAndPages = () => (
  <Box
    sx={{
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    }}>
    <IsbnField fieldName={ResourceFieldNames.IsbnList} />
    <TotalPagesField />
  </Box>
);
