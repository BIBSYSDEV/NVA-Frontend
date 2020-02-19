import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledContentPage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: center;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 1rem 1rem;
  }
`;

interface ContentPageProps {
  children: ReactNode;
}

const ContentPage: React.FC<ContentPageProps> = ({ children, ...props }) => (
  <StyledContentPage {...props}>{children}</StyledContentPage>
);

export default ContentPage;
