import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledContentPage = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  align-self: center;
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    align-items: center;
    margin: 1rem 2rem;
  }
  flex-grow: 1;
`;

interface ContentPageProps {
  children: ReactNode;
}

const ContentPage: React.FC<ContentPageProps> = ({ children, ...props }) => (
  <StyledContentPage {...props}>{children}</StyledContentPage>
);

export default ContentPage;
