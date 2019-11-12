import React from 'react';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import Person from '@material-ui/icons/Person';

import ContributorArrows from './ContributorArrows';
import ContributorType from '../../../types/contributor.types';
import { useDispatch } from 'react-redux';
import { updateContributor, removeContributor, moveContributor } from '../../../redux/actions/contributorActions';

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

const StyledInstitution = styled(Select)`
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
  key: string;
}

const Contributor: React.FC<ContributorProps> = ({ contributor }) => {
  const dispatch = useDispatch();

  const handleCorrespondingAuthorChange = (contributor: ContributorType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    contributor.corresponding = event.target.checked;
    dispatch(updateContributor(contributor));
  };

  const handleInstitutionChange = (contributor: ContributorType) => (event: React.ChangeEvent<any>) => {
    contributor.institutionChoice = event.target.value;
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
      <StyledInstitution onChange={handleInstitutionChange(contributor)} value={contributor.institutionChoice}>
        <MenuItem value="" key="-1" />
        {contributor.institutions &&
          contributor.institutions.map(institution => (
            <MenuItem value={institution} key={institution}>
              {institution}
            </MenuItem>
          ))}
      </StyledInstitution>
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
