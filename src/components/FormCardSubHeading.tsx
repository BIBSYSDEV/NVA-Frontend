import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  font-size: 1.2rem;
`;

interface FormCardLabelPropsProps {
  children: ReactNode;
}

const FormCardLabelProps: FC<FormCardLabelPropsProps> = ({ children }) => {
  return <StyledTypography variant="h3">{children}</StyledTypography>;
};

export default FormCardSubHeading;
