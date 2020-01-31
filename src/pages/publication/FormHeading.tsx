import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  ${props => {
    switch (props.variant) {
      case 'h1':
        return 'color: pink';
      case 'h2':
        return 'font-size: 0.3rem';
    }
  }}
`;

interface props {
  children: any;
  variant: any;
}

//EXAMPLE 1 : with props.
const FormHeading: FC<props> = ({ children, variant }) => {
  return <StyledTypography variant={variant}>{children}</StyledTypography>;
};

export default FormHeading;
