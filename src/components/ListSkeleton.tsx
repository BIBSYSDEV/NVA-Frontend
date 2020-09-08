import React, { FC, useRef } from 'react';
import { Skeleton } from '@material-ui/lab';
import { getRandomWidthPercent } from '../utils/skeleton-helpers';

interface ListSkeletonProps {
  arrayLength?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
}

const ListSkeleton: FC<ListSkeletonProps> = ({ arrayLength, height, minWidth, maxWidth }) => {
  const widthsRef = useRef(
    Array.from({ length: arrayLength ?? 3 }, () => getRandomWidthPercent(minWidth ?? 10, maxWidth ?? 100))
  );

  return (
    <>
      {widthsRef.current.map((width, index) => (
        <Skeleton key={index} width={width} height={height ?? 40} />
      ))}
    </>
  );
};

export default ListSkeleton;
