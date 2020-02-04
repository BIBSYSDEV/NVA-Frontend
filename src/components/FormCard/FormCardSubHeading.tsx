import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.2rem;
`;

interface FormCardSubHeadingProps {
  children: ReactNode;
}

const FormCardSubHeading: FC<FormCardSubHeadingProps> = ({ children, ...props }) => (
  <StyledTypography variant="h3" {...props}>
    {children}
  </StyledTypography>
);

export default FormCardSubHeading;
