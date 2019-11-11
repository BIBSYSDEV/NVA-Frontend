import React from 'react';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import Person from '@material-ui/icons/Person';

import ContributorArrows from './ContributorArrows';

const StyledContributor = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  display: grid;
  grid-template-areas: 'icon name institution switch orcid arrows delete';
  grid-template-columns: 5% 30% 20% 10% 5% 5% 5%;
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
  id: string;
  name: string;
  institutions?: string[];
  orcid?: string;
  deleteContributor: (event: React.MouseEvent<any>, id: string) => void;
  moveContributor: (id: string, direction: number) => void;
}

const Contributor: React.FC<ContributorProps> = ({
  id,
  name,
  institutions,
  orcid,
  deleteContributor,
  moveContributor,
}) => {
  const handleChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <StyledContributor>
      <StyledPersonIcon />
      <StyledName>{name}</StyledName>
      <StyledInstitution>
        <MenuItem value="" />
        {institutions && institutions.map(institution => <MenuItem value={institution}>{institution}</MenuItem>)}
      </StyledInstitution>
      <StyledCorrespondingAuthor onChange={handleChange(id)} value={id} />
      <StyledOrcidIcon>
        {orcid && <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}
      </StyledOrcidIcon>
      <StyledContributorsArrows moveContributor={moveContributor} id={id} />
      <StyledDeleteIcon onClick={event => deleteContributor(event, id)} />
    </StyledContributor>
  );
};

export default Contributor;
