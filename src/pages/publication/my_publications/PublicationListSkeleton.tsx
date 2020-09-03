import React, { FC } from 'react';
import { Skeleton } from '@material-ui/lab';

export const PublicationListSkeleton: FC = () => (
  <>
    <Skeleton height={70} />
    <Skeleton height={70} />
    <Skeleton height={70} />
  </>
);
