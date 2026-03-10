import { Skeleton } from '@mui/material';
import { VerticalBox } from '../styled/Wrappers';

export const TableSkeleton = () => {
  return (
    <VerticalBox sx={{ width: '100%' }}>
      <Skeleton sx={{ width: '100%', height: '5rem' }} />
      <Skeleton sx={{ width: '100%', height: '5rem' }} />
      <Skeleton sx={{ width: '100%', height: '5rem' }} />
    </VerticalBox>
  );
};
