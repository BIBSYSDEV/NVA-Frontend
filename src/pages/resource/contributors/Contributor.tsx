import React, { Dispatch } from 'react';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import Person from '@material-ui/icons/Person';

import { moveContributor, removeContributor, updateContributor } from '../../../redux/actions/contributorActions';
import ContributorType from '../../../types/contributor.types';
import ContributorArrows from './ContributorArrows';

const StyledContributor = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  display: grid;
  grid-template-areas: 'icon name institution switch orcid arrows delete';
  grid-template-columns: 5% 30% 18% 10% 5% 5% 5%;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const StyledPersonIcon = styled(Person)`
  grid-area: icon;
`;

const StyledName = styled.div`
  grid-area: name;
`;

const StyledSelect = styled(Select)`
  grid-area: institution;
`;

const StyledCorrespondingAuthor = styled(Switch)`
  grid-area: switch;
`;

const StyledOrcidIcon = styled.div`
  grid-area: orcid;
`;

const StyledContributorsArrows = styled(ContributorArrows)`
  grid-area: arrows;
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  grid-area: delete;
`;

interface ContributorProps {
  contributor: ContributorType;
  dispatch: Dispatch<any>;
}

const Contributor: React.FC<ContributorProps> = ({ contributor, dispatch }) => {
  const handleCorrespondingAuthorChange = (contributor: ContributorType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    <StyledContributor>
      <StyledPersonIcon />
      <StyledName>{contributor.name}</StyledName>
      <StyledSelect onChange={handleInstitutionChange(contributor)} value={contributor.selectedInstitution || ''}>
        <MenuItem value="" key="-1" />
        {contributor.institutions &&
          contributor.institutions.map(institution => (
            <MenuItem value={institution} key={institution}>
              {institution}
            </MenuItem>
          ))}
      </StyledSelect>
      <StyledCorrespondingAuthor
        onChange={handleCorrespondingAuthorChange(contributor)}
        checked={contributor.corresponding}
      />
      <StyledOrcidIcon>
        {contributor.orcid && (
          <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />
        )}
      </StyledOrcidIcon>
      <StyledContributorsArrows contributor={contributor} onMoveContributor={onMoveContributor} />
      <StyledDeleteIcon onClick={() => deleteContributor(contributor)} />
    </StyledContributor>
  );
};

export default Contributor;
