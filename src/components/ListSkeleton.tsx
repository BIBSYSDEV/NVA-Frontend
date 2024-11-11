import { Skeleton } from '@mui/material';
import { useRef } from 'react';
import { dataTestId } from '../utils/dataTestIds';
import { getRandomWidthPercent } from '../utils/skeleton-helpers';

interface ListSkeletonProps {
  arrayLength?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const ListSkeleton = ({ arrayLength, height, minWidth, maxWidth }: ListSkeletonProps) => {
  const widthsRef = useRef(
    Array.from({ length: arrayLength ?? 3 }, () => getRandomWidthPercent(minWidth ?? 10, maxWidth ?? 100))
  );

  return (
    <div data-testid={dataTestId.common.skeleton}>
      {widthsRef.current.map((width, index) => (
        <Skeleton key={index} width={width} height={height ?? 40} />
      ))}
    </div>
  );
};
