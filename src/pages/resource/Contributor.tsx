import '../../styles/pages/resource/contributor.scss';

import React from 'react';
import Person from '@material-ui/icons/Person';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import ContributorArrows from './ContributorArrows';

const StyledContributor = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
`;

interface ContributorProps {
  id: string;
  name: string;
  institutions?: string[];
  orcid?: string;
  deleteContributor: (event: React.MouseEvent<any>, id: string) => void;
}

const Contributor: React.FC<ContributorProps> = ({ id, name, institutions, orcid, deleteContributor }) => {
  const handleChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {};

  const onClickUp = (event: React.MouseEvent<any>, id: string): void => {};
  const onClickDown = (event: React.MouseEvent<any>, id: string): void => {};

  return (
    <StyledContributor>
      <div className="container">
        <div className="contributor-icon">
          <Person />
        </div>
        <div className="contributor-name">{name}</div>
        <div className="contributor-institution">
          <Select>
            <MenuItem value="" />
            {institutions && institutions.map(institution => <MenuItem value={institution}>{institution}</MenuItem>)}
          </Select>
        </div>
        <div className="contributor-switch">
          <Switch onChange={handleChange(id)} value={id} />
        </div>
        <div className="contributor-orcid-icon">
          {orcid && <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}
        </div>
        <ContributorArrows onClickUp={onClickUp(id)} onClickDown={onClickDown(id)} id={id} />
        <div className="contributor-delete-icon">
          <DeleteIcon onClick={event => deleteContributor(event, id)} />
        </div>
      </div>
    </StyledContributor>
  );
};

export default Contributor;
