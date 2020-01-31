import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  font-size: 1rem;
  font-weight: bold;
`;

interface props {
  children: any;
}

const FormCardLabel: FC<props> = ({ children }) => {
  return <StyledTypography variant="h4">{children}</StyledTypography>;
};

export default FormCardLabel;
