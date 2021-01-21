import React, { ReactNode } from 'react';
import styled from 'styled-components';
import ContrastContent from './ContrastContent';

interface BakcgroundDivProps {
  backgroundColor: string;
  children?: ReactNode;
}

const StyledBackgroundDiv = styled(({ backgroundColor, ...rest }) => <div {...rest} />)`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem;
  }
  padding: 0.5rem;
  ${({ backgroundColor }) => `background-color: ${backgroundColor}`}
`;

const BackgroundDiv = ({ children, ...props }: BakcgroundDivProps) => (
  <StyledBackgroundDiv {...props}>
    <ContrastContent backgroundColor={props.backgroundColor}>{children}</ContrastContent>
  </StyledBackgroundDiv>
);

export default BackgroundDiv;
