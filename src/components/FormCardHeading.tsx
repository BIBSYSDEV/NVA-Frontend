import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.5rem;
  font-weight: bold;
`;

interface props {
  children: any;
}

const FormCardHeading: FC<props> = ({ children }) => {
  return <StyledTypography variant="h2">{children}</StyledTypography>;
};

export default FormCardHeading;
