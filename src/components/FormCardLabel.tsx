import React, { FC, ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  font-size: 1rem;
  font-weight: bold;
`;

interface FormCardLabelProps {
  children: ReactNode;
}

const FormCardLabel: FC<FormCardLabelProps> = ({ children }) => (
  <StyledTypography variant="h4">{children}</StyledTypography>
);

export default FormCardLabel;
