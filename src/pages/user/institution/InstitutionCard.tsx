import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Card from '../../../components/Card';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';

const StyledCard = styled(Card)`
  display: grid;
  grid-template-areas: 'text button';
  grid-template-columns: auto 7rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  min-height: 5rem;
  border-radius: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'text' 'button';
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StyledTextContainer = styled.div`
  grid-area: text;
`;

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  grid-area: button;
  align-items: center;
  display: grid;
  gap: 1rem;
`;

interface InstitutionCardProps {
  openEditUnitForm: (oldOrgunitId: string) => void;
  orgunitId: string;
  setAffiliationIdToRemove: (orgunitId: string) => void;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ openEditUnitForm, orgunitId, setAffiliationIdToRemove }) => {
  const { t } = useTranslation('common');
  const [hideCard, setHideCard] = useState(false);

  return !hideCard ? (
    <StyledCard data-testid="institution-presentation">
      <StyledTextContainer>
        <AffiliationHierarchy unitUri={orgunitId} />
      </StyledTextContainer>
      <StyledButtonContainer>
        <Button
          variant="outlined"
          color="primary"
          data-testid={`button-edit-institution-${orgunitId}`}
          onClick={() => {
            openEditUnitForm(orgunitId);
            setHideCard(true);
          }}>
          <EditIcon />
          {t('edit')}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          data-testid={`button-delete-institution-${orgunitId}`}
          onClick={() => setAffiliationIdToRemove(orgunitId)}>
          <DeleteIcon />
          {t('remove')}
        </Button>
      </StyledButtonContainer>
    </StyledCard>
  ) : null;
};

export default InstitutionCard;
