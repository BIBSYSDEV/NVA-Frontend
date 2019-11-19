import React, { Dispatch } from 'react';
import styled from 'styled-components';

import { MenuItem, TextField } from '@material-ui/core';

import { removeContributor, updateContributor } from '../../../redux/actions/contributorActions';
import ContributorType from '../../../types/contributor.types';
import contributorTypes from '../../../utils/testfiles/contributor_types.json';
import StyledContributor from './StyledContributor';

const StyledNameInput = styled(TextField)`
  background-color: ${({ theme }) => theme.palette.background.default};
  margin-right: 1rem;
`;

interface OtherContributorProps {
  contributor: ContributorType;
  dispatch: Dispatch<any>;
}

const OtherContributor: React.FC<OtherContributorProps> = ({ contributor, dispatch }) => {
  const handleTypeChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.type = event.target.value;
    dispatch(updateContributor(contributor));
  };

  const handleInstitutionChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.selectedInstitution = event.target.value;
    dispatch(updateContributor(contributor));
  };

  const handleNameChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.name = event.target.value;
    dispatch(updateContributor(contributor));
  };

  const deleteContributor = (contributor: ContributorType): void => {
    dispatch(removeContributor(contributor));
  };

  return (
    <StyledContributor.OtherContributorContainer>
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
      <StyledNameInput
        value={contributor.name}
        onChange={handleNameChange(contributor)}
        margin="dense"
        variant="outlined"
      />
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
    </StyledContributor.OtherContributorContainer>
  );
};

export default OtherContributor;
