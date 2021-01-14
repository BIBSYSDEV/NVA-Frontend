import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface SectionProps {
  backgroundColor?: string;
  children?: ReactNode;
}

const StyledSection = styled(({ backgroundColor, ...rest }) => <div {...rest} />)`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 2rem;
  }
  padding: 0.5rem;
  margin-bottom: 1rem;
  ${({ backgroundColor }) => `background-color: ${backgroundColor}`}
`;

const Section = ({ children, ...props }: SectionProps) => <StyledSection {...props}>{children}</StyledSection>;

export default Section;
