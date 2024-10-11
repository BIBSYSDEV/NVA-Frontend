import { Box, Skeleton } from '@mui/material';
import { useRef } from 'react';
import { getRandomWidthPercent } from '../../utils/skeleton-helpers';

interface AffiliationSkeletonProps {
  commaSeparated?: boolean;
}

export const AffiliationSkeleton = ({ commaSeparated = false }: AffiliationSkeletonProps) => {
  const widthsRef = useRef({
    long: getRandomWidthPercent(50, 80),
    medium: getRandomWidthPercent(35, 50),
    short: getRandomWidthPercent(20, 35),
  });

  return (
    <Box sx={{ width: '100%' }}>
      {commaSeparated ? (
        <Skeleton width={widthsRef.current.long} />
      ) : (
        <>
          <Skeleton width={widthsRef.current.medium} />
          <Skeleton width={widthsRef.current.short} />
          <Skeleton width={widthsRef.current.short} />
        </>
      )}
    </Box>
  );
};
