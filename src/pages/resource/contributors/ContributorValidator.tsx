import React from 'react';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import { useTranslation } from 'react-i18next';
import StyledContributor from './StyledContributor';

const StyledContributorValidator = styled(StyledContributor.ContributorContainer)`
  grid-template-areas: 'icon name institution verify-person verify-person . delete';
`;

const StyledNameInput = styled(StyledContributor.Name)`
  height: 2rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  margin-right: 1rem;
`;

const ContributorValidator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <StyledContributorValidator>
      <StyledContributor.AddCircleIcon />
      <StyledNameInput />
      <StyledContributor.Select value="" variant="outlined">
        <MenuItem value="TEST">TEST</MenuItem>
      </StyledContributor.Select>
      <StyledContributor.VerifyPerson color="primary" variant="contained" startIcon={<PersonIcon />}>
        {t('contributors.verify_person')}
      </StyledContributor.VerifyPerson>
      <StyledContributor.DeleteIcon />
    </StyledContributorValidator>
  );
};

export default ContributorValidator;
