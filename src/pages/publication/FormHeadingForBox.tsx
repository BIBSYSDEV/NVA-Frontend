import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  color: red;
  font-size: 1.3rem;
`;

interface props {
  children: any;
}

//EXAMPLE 2 : one component pr heading type.

const FormHeadingForBox: FC<props> = ({ children }) => {
  return <StyledTypography>{children}</StyledTypography>;
};

export default FormHeadingForBox;
