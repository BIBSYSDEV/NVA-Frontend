import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
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
