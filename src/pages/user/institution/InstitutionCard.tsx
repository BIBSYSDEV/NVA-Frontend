import React, { FC } from 'react';
import styled from 'styled-components';
import Label from '../../../components/Label';
import { Unit, UnitBase } from '../../../types/institution.types';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';

const StyledSelectedInstitution = styled.div`
  display: grid;
  grid-template-areas: 'text button';
  grid-template-columns: auto 7rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  min-height: 5rem;
  border-radius: 4px;
`;

const StyledTextContainer = styled.div`
  grid-area: text;
`;

const StyledInstitutionText = styled.div`
  height: 1.5rem;
`;
// check if should use Typography here

const StyledButtonContainer = styled.div`
  grid-area: button;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

interface InstitutionCardProps {
  unit: Unit;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ unit }) => {
  const { t } = useTranslation('common');

  const handleRemoveInstitution = () => {
    // get last subunit id and remove it from ARP
    console.log('remove', unit.id);
    console.log('subunits', unit.subunits);
  };

  return (
    <StyledSelectedInstitution data-testid="institution-presentation">
      <StyledTextContainer>
        <Label>{unit.name}</Label>
        {unit.subunits?.map((subunit: UnitBase) => (
          <StyledInstitutionText key={subunit.id} data-testid="institution-presentation-subunit">
            {subunit.name}
          </StyledInstitutionText>
        ))}
      </StyledTextContainer>
      <StyledButtonContainer>
        <Button
          color="secondary"
          variant="outlined"
          data-testid={`delete-publication-${unit.id}`}
          onClick={handleRemoveInstitution}>
          <DeleteIcon />
          {t('remove')}
        </Button>
      </StyledButtonContainer>
    </StyledSelectedInstitution>
  );
};

export default InstitutionCard;
