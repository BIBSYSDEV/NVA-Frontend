import { Skeleton, SkeletonProps } from '@mui/material';

export const SkeletonLine = ({ sx, ...props }: SkeletonProps) => {
  return <Skeleton sx={{ width: '2ch', margin: 'auto', ...sx }} {...props} />;
};
