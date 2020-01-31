import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.2rem;
`;

interface props {
  children: any;
}

const FormCardSubHeading: FC<props> = ({ children }) => {
  return <StyledTypography variant="h3">{children}</StyledTypography>;
};

export default FormCardSubHeading;
