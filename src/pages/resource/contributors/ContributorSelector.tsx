import React from 'react';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import StyledContributor from './StyledComponents';

const StyledContributorSelector = styled(StyledContributor.ContributorContainer)`
  grid-template-areas: 'icon name institution verify-person verify-person . delete';
`;

const StyledNameInput = styled(StyledContributor.Name)`
  height: 2rem;
  background-color: white;
  margin-right: 1rem;
`;

const StyledPersonIcon = styled(StyledContributor.PersonIcon)`
  color: white;
`;

const ContributorSelector: React.FC = () => {
  const { t } = useTranslation();

  return (
    <StyledContributorSelector>
      <StyledContributor.AddIcon />
      <StyledNameInput />
      <StyledContributor.Select>
        <MenuItem value=""></MenuItem>
        text
      </StyledContributor.Select>
      <StyledContributor.VerifyPerson color="primary" variant="contained">
        <StyledPersonIcon />
        {t('contributors.verify_person')}
      </StyledContributor.VerifyPerson>
      <StyledContributor.DeleteIcon />
    </StyledContributorSelector>
  );
};

export default ContributorSelector;
