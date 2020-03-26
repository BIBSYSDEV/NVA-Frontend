import React, { FC, ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  font-size: 1rem;
`;

interface NormalTextProps {
  children: ReactNode;
}

const NormalText: FC<NormalTextProps> = ({ children, ...props }) => (
  <StyledTypography variant="body1" {...props}>
    {children}
  </StyledTypography>
);

export default NormalText;
