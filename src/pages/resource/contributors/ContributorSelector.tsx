import React from 'react';
import styled from 'styled-components';

const StyledContributorSelector = styled.div``;

interface ContributorSelectorProps {
  addContributor: () => void;
}

const ContributorSelector: React.FC<ContributorSelectorProps> = ({ addContributor }) => {
  return <StyledContributorSelector>Select contributor here</StyledContributorSelector>;
};

export default ContributorSelector;
