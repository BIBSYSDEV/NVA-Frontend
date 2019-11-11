import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledContributorLabel = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
`;

interface ContributorLabelProps {
  children: ReactNode;
}

const ContributorLabel: React.FC<ContributorLabelProps> = ({ children }) => (
  <StyledContributorLabel>{children}</StyledContributorLabel>
);

export default ContributorLabel;
