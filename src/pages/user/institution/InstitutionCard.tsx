import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import Card from '../../../components/Card';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';
import useFetchUnitHierarchy from '../../../utils/hooks/useFetchUnitHierarchy';

const StyledCard = styled(Card)`
  display: grid;
  grid-template-areas: 'text button';
  grid-template-columns: auto 7rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  min-height: 5rem;
  border-radius: 4px;
`;

const StyledTextContainer = styled.div`
  grid-area: text;
`;

const StyledButtonContainer = styled.div`
  grid-area: button;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

interface InstitutionCardProps {
  orgunitId: string;
  setAffiliationIdToRemove: (orgunitId: string) => void;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ orgunitId, setAffiliationIdToRemove }) => {
  const { t } = useTranslation('common');
  const [unit, isLoadingUnitHierarchy] = useFetchUnitHierarchy(orgunitId);

  return (
    <StyledCard data-testid="institution-presentation">
      {isLoadingUnitHierarchy ? (
        <CircularProgress />
      ) : (
        <>
          <StyledTextContainer>{unit && <AffiliationHierarchy unit={unit} />}</StyledTextContainer>
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
        </>
      )}
    </StyledCard>
  );
};

export default InstitutionCard;
