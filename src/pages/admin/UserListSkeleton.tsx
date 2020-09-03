import React, { FC, useRef } from 'react';
import { Skeleton } from '@material-ui/lab';
import { getRandomWidthPercent } from '../../utils/skeleton-helpers';

export const UserListSkeleton: FC = () => {
  const widthsRef = useRef(Array.from({ length: 3 }, () => getRandomWidthPercent(10, 25)));

  return (
    <>
      {widthsRef.current.map((width, index) => (
        <Skeleton key={index} width={width} height={40} />
      ))}
    </>
  );
};
