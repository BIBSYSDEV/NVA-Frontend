import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
`;

interface SubHeadingProps {
  children: ReactNode;
}

const SubHeading: FC<SubHeadingProps> = ({ children, ...props }) => (
  <StyledTypography variant="h3" {...props}>
    {children}
  </StyledTypography>
);

export default SubHeading;
