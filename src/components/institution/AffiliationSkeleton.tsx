import React, { FC } from 'react';
import { Skeleton } from '@material-ui/lab';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 100%;
`;

export const AffiliationSkeleton: FC<{ commaSeparated?: boolean }> = ({ commaSeparated = false }) => (
  <StyledDiv>
    {commaSeparated ? (
      <Skeleton width="70%" />
    ) : (
      <>
        <Skeleton width="60%" />
        <Skeleton width="40%" />
        <Skeleton width="40%" />
      </>
    )}
  </StyledDiv>
);
