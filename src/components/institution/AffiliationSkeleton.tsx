import React, { FC, useRef } from 'react';
import { Skeleton } from '@material-ui/lab';
import styled from 'styled-components';
import { getRandomWidthPercent } from '../../utils/skeleton-helpers';

const StyledDiv = styled.div`
  width: 100%;
`;

export const AffiliationSkeleton: FC<{ commaSeparated?: boolean }> = ({ commaSeparated = false }) => {
  const widthsRef = useRef({
    long: getRandomWidthPercent(50, 80),
    medium: getRandomWidthPercent(35, 50),
    short: getRandomWidthPercent(20, 35),
  });

  return (
    <StyledDiv>
      {commaSeparated ? (
        <Skeleton width={widthsRef.current.long} />
      ) : (
        <>
          <Skeleton width={widthsRef.current.medium} />
          <Skeleton width={widthsRef.current.short} />
          <Skeleton width={widthsRef.current.short} />
        </>
      )}
    </StyledDiv>
  );
};
