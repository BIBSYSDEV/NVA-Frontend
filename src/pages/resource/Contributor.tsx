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
  contributor: any;
  deleteContributor: (event: React.MouseEvent<any>, id: string) => void;
  moveContributor: (id: string, direction: number) => void;
  onInstitutionChange: (id: string, institution: string) => void;
  onCorrespondingChange: (id: string) => void;
}

const Contributor: React.FC<ContributorProps> = ({
  contributor,
  deleteContributor,
  moveContributor,
  onInstitutionChange,
  onCorrespondingChange,
}) => {
  return (
    <StyledContributor>
      <div className="container">
        <div className="contributor-icon">
          <Person />
        </div>
        <div className="contributor-name">{contributor.name}</div>
        <div className="contributor-institution">
          <Select value={contributor.institutionChoice}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
              onInstitutionChange(contributor.id, event.target.value as string)
            }>
            <MenuItem value={contributor.onInstitutionChange} />
            {contributor.institutions &&
              contributor.institutions.map((institution: string) => (
                <MenuItem value={institution}>{institution}</MenuItem>
              ))}
          </Select>
        </div>
        <div className="contributor-switch">
          <Switch onChange={() => onCorrespondingChange(contributor.id)} value={contributor.corresponding} />
        </div>
        <div className="contributor-orcid-icon">
          {contributor.orcid && (
            <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />
          )}
        </div>
        <ContributorArrows moveContributor={moveContributor} id={contributor.id} />
        <div className="contributor-delete-icon">
          <DeleteIcon onClick={event => deleteContributor(event, contributor.id)} />
        </div>
      </div>
    </StyledContributor>
  );
};

export default Contributor;
