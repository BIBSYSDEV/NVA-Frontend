import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface SelectedFacetsListProps {
  children: ReactNode;
}

export const SelectedFacetsList = ({ children }: SelectedFacetsListProps) => {
  return (
    <Box component="ul" sx={{ m: '0 0 0.5rem 0', p: 0, display: 'flex', gap: '0.25rem 0.5rem', flexWrap: 'wrap' }}>
      {children}
    </Box>
  );
};
