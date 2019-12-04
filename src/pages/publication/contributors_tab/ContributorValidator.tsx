import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { MenuItem, TextField } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import { removeContributor, updateContributor } from '../../../redux/actions/contributorActions';
import ContributorType from '../../../types/contributor.types';
import StyledContributor from './StyledContributor';

const StyledContributorValidator = styled(StyledContributor.ContributorContainer)`
  grid-template-areas: 'icon name institution verify-person verify-person . delete';
`;

const StyledNameInput = styled(TextField)`
  background-color: ${({ theme }) => theme.palette.background.default};
  margin-right: 1rem;
`;

interface ContributorValidatorProps {
  contributor: ContributorType;
  dispatch: Dispatch<any>;
}

const ContributorValidator: React.FC<ContributorValidatorProps> = ({ contributor, dispatch }) => {
  const { t } = useTranslation();

  const deleteContributor = (contributor: ContributorType): void => {
    dispatch(removeContributor(contributor));
  };

  const validateContributor = (contributor: ContributorType): void => {
    contributor.verified = true;
    dispatch(updateContributor(contributor));
  };

  const handleNameChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.name = event.target.value;
    dispatch(updateContributor(contributor));
  };

  return (
    <StyledContributorValidator>
      <StyledContributor.AddCircleIcon />
      <StyledNameInput variant="outlined" onChange={handleNameChange(contributor)} value={contributor.name} />
      <StyledContributor.Select variant="outlined">
        <MenuItem value=""></MenuItem>
      </StyledContributor.Select>
      <StyledContributor.VerifyPerson
        color="primary"
        variant="contained"
        startIcon={<PersonIcon />}
        onClick={() => validateContributor(contributor)}>
        {t('publication:contributors.verify_person')}
      </StyledContributor.VerifyPerson>
      <StyledContributor.DeleteIcon onClick={() => deleteContributor(contributor)} />
    </StyledContributorValidator>
  );
};

export default ContributorValidator;
