import React, { FC, ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  font-size: 1rem;
  font-weight: bold;
`;

interface LabelProps {
  children: ReactNode;
}

const Label: FC<LabelProps> = ({ children, ...props }) => (
  <StyledTypography variant="h4" {...props}>
    {children}
  </StyledTypography>
);

export default Label;
