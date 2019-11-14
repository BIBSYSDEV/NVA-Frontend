import React, { Dispatch } from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import ContributorType from '../../../types/contributor.types';
import { updateContributor, removeContributor } from '../../../redux/actions/contributorActions';
import contributorTypes from '../../../utils/testfiles/contributor_types.json';
import StyledContributor from './StyledComponents';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ContributorLabel from './ContributorLabel';

const StyledContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  display: grid;
  grid-template-areas:
    'type-heading name-heading institution-heading .'
    'type name institution delete';
  grid-template-columns: 18% 30% 18% 5%;
  grid-column-gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
`;

const StyledNameInput = styled(TextField)`
  height: 1rem;
  background-color: white;
  margin-right: 1rem;
`;

interface OtherContributorProps {
  contributor: ContributorType;
  dispatch: Dispatch<any>;
}

const OtherContributor: React.FC<OtherContributorProps> = ({ contributor, dispatch }) => {
  const { t } = useTranslation();

  const handleTypeChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.type = event.target.value;
    dispatch(updateContributor(contributor));
  };

  const handleInstitutionChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.selectedInstitution = event.target.value;
    dispatch(updateContributor(contributor));
  };

  const deleteContributor = (contributor: ContributorType): void => {
    dispatch(removeContributor(contributor));
  };

  return (
    <StyledContainer>
      <ContributorLabel>{t('contributors.type')}</ContributorLabel>
      <ContributorLabel>{t('contributors.name')}</ContributorLabel>
      <ContributorLabel>{t('contributors.institution')}</ContributorLabel>
      <div />

      <StyledContributor.TypeSelect
        onChange={handleTypeChange(contributor)}
        value={contributor.type || ''}
        variant="outlined">
        <MenuItem value="" key="-1" />
        {contributorTypes
          .filter(type => type !== 'Author')
          .map(type => (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          ))}
      </StyledContributor.TypeSelect>
      <StyledNameInput value={contributor.name} />
      <StyledContributor.InstitutionSelect
        onChange={handleInstitutionChange(contributor)}
        value={contributor.selectedInstitution || ''}
        variant="outlined">
        <MenuItem value="" key="-1" />
        {contributor.institutions &&
          contributor.institutions.map(institution => (
            <MenuItem value={institution} key={institution}>
              {institution}
            </MenuItem>
          ))}
      </StyledContributor.InstitutionSelect>
      <StyledContributor.DeleteIcon onClick={() => deleteContributor(contributor)} />
    </StyledContainer>
  );
};

export default OtherContributor;
