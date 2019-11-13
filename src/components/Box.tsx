import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledBox = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
`;

interface BoxProps {
  children?: ReactNode;
}

const Box: React.FC<BoxProps> = ({ children }) => <StyledBox>{children}</StyledBox>;

export default Box;
