import React, { FC } from 'react';
import styled from 'styled-components';
import Label from '../../../components/Label';
import { Unit, Subunit } from '../../../types/institution.types';

const StyledSelectedInstitution = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  min-height: 5rem;
  border-radius: 4px;
`;

const StyledInstitutionText = styled.div`
  height: 1.5rem;
`;

interface InstitutionCardProps {
  unit: Unit;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ unit }) => (
  <StyledSelectedInstitution data-testid="institution-presentation">
    <Label>{unit.name}</Label>
    {unit.subunits.length > 0 &&
      unit.subunits.map((subunit: Subunit) => (
        <StyledInstitutionText key={subunit.id} data-testid="institution-presentation-subunit">
          {subunit.name}
        </StyledInstitutionText>
      ))}
  </StyledSelectedInstitution>
);

export default InstitutionCard;
