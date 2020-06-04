import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import Card from '../../../components/Card';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';
import { RightAlignedButtonWrapper } from '../../../components/styled/Wrappers';

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

const StyledButtonContainer = styled(RightAlignedButtonWrapper)`
  grid-area: button;
  align-items: center;
`;

interface InstitutionCardProps {
  orgunitId: string;
  setAffiliationIdToRemove: (orgunitId: string) => void;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ orgunitId, setAffiliationIdToRemove }) => {
  const { t } = useTranslation('common');

  return (
    <StyledCard data-testid="institution-presentation">
      <StyledTextContainer>
        <AffiliationHierarchy unitUri={orgunitId} />
      </StyledTextContainer>
      <StyledButtonContainer>
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
  );
};

export default InstitutionCard;
