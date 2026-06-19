import { Skeleton, SkeletonProps } from '@mui/material';

export const SkeletonLine = (props: SkeletonProps) => {
  return <Skeleton sx={{ width: '2ch', margin: 'auto' }} {...props} />;
};
