import React, { FC, useRef } from 'react';
import { Skeleton } from '@material-ui/lab';
import { randomWidthPercent } from '../../utils/skeleton-helpers';

export const UserListSkeleton: FC = () => {
  const widthsRef = useRef(Array.from({ length: 3 }, () => randomWidthPercent(10, 25)));

  return (
    <>
      {widthsRef.current.map((width) => (
        <Skeleton width={width} height={40} />
      ))}
    </>
  );
};
