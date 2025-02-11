import { Box, Skeleton } from '@mui/material';

const getRandomWidth = () => `${Math.random() * 60 + 30}%`;

export const FacetContentSkeleton = () => {
  return (
    <Box sx={{ m: '1rem', mb: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
      <Skeleton sx={{ width: getRandomWidth() }} />
      <Skeleton sx={{ width: '3rem', ml: 'auto' }} />

      <Skeleton sx={{ width: getRandomWidth() }} />
      <Skeleton sx={{ width: '3rem', ml: 'auto' }} />

      <Skeleton sx={{ width: getRandomWidth() }} />
      <Skeleton sx={{ width: '2rem', ml: 'auto' }} />
    </Box>
  );
};
