import React, { Dispatch } from 'react';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';

import { moveContributor, removeContributor, updateContributor } from '../../../redux/actions/contributorActions';
import ContributorType from '../../../types/contributor.types';
import ContributorStyles from './StyledComponents';

const StyledContainer = styled(ContributorStyles.ContributorContainer)`
  margin-bottom: 0.5rem;
  align-items: center;
`;

const StyledInstitutionSelect = styled(ContributorStyles.Select)`
  grid-area: institution;
`;

interface ContributorProps {
  contributor: ContributorType;
  dispatch: Dispatch<any>;
}

const Contributor: React.FC<ContributorProps> = ({ contributor, dispatch }) => {
  const handleCorrespondingAuthorChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.corresponding = event.target.checked;
    dispatch(updateContributor(contributor));
  };

  const handleInstitutionChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.selectedInstitution = event.target.value;
    dispatch(updateContributor(contributor));
  };

  const deleteContributor = (contributor: ContributorType): void => {
    dispatch(removeContributor(contributor));
  };

  const onMoveContributor = (contributor: ContributorType, direction: number) => {
    dispatch(moveContributor(contributor, direction));
  };

  return (
    <StyledContainer>
      <ContributorStyles.PersonIcon />
      <ContributorStyles.Name>{contributor.name}</ContributorStyles.Name>
      <StyledInstitutionSelect
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
      </StyledInstitutionSelect>
      <ContributorStyles.CorrespondingAuthor
        onChange={handleCorrespondingAuthorChange(contributor)}
        checked={contributor.corresponding}
      />
      <ContributorStyles.OrcidIcon>
        {contributor.orcid && (
          <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />
        )}
      </ContributorStyles.OrcidIcon>
      <ContributorStyles.ContributorsArrows contributor={contributor} onMoveContributor={onMoveContributor} />
      <ContributorStyles.DeleteIcon onClick={() => deleteContributor(contributor)} />
    </StyledContainer>
  );
};

export default Contributor;
