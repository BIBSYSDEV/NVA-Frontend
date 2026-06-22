import { Skeleton, SkeletonProps } from '@mui/material';

export const SkeletonLine = ({ sx, ...props }: SkeletonProps) => {
  return <Skeleton sx={{ width: '1rem', margin: 'auto', ...sx }} {...props} />;
};
