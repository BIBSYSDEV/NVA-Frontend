import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.5rem;
  font-weight: bold;
`;

interface HeadingProps {
  children: ReactNode;
}

const Heading: FC<HeadingProps> = ({ children, ...props }) => (
  <StyledTypography variant="h2" {...props}>
    {children}
  </StyledTypography>
);

export default Heading;
