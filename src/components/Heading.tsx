import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

interface HeadingProps {
  children: ReactNode;
}

const Heading = ({ children, ...props }: HeadingProps) => (
  <StyledTypography variant="h2" {...props}>
    {children}
  </StyledTypography>
);

export default Heading;
