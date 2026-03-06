import { Box, Skeleton } from '@mui/material';

export const NviDialoguePanelSkeleton = () => {
  return (
    <Box sx={{ mx: '1rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Skeleton width="100%" height={80} />
      <Skeleton width="100%" height={150} />
      <Skeleton width="100%" height={60} />
      <Skeleton width="100%" height={100} />
      <Skeleton width="100%" height={40} />
      <Skeleton width="100%" height={80} />
      <Skeleton width="100%" height={40} />
      <Skeleton width="100%" height={100} />
      <Skeleton width="100%" height={150} />
    </Box>
  );
};
