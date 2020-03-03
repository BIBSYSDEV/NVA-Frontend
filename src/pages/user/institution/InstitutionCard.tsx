import React, { FC } from 'react';
import styled from 'styled-components';
import Label from '../../../components/Label';
import { InstitutionUnit, InstitutionUnitBase } from '../../../types/institution.types';

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
  unit: InstitutionUnit;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ unit }) => (
  <StyledSelectedInstitution data-testid="institution-presentation">
    <Label>{unit.name}</Label>
    {unit.subunits?.map((subunit: InstitutionUnitBase) => (
      <StyledInstitutionText key={subunit.id} data-testid="institution-presentation-subunit">
        {subunit.name}
      </StyledInstitutionText>
    ))}
  </StyledSelectedInstitution>
);

export default InstitutionCard;
