import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { getDepartment } from '../../../api/institutionApi';
import Card from '../../../components/Card';
import { RecursiveInstitutionUnit } from '../../../types/institution.types';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import Progress from '../../../components/Progress';
import { CRISTIN_UNITS_BASE_URL, CRISTIN_INSTITUTIONS_BASE_URL } from '../../../utils/constants';
import AffiliationHierarchy from '../../../components/AffiliationHierarchy';

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
  const dispatch = useDispatch();
  const [unit, setUnit] = useState<RecursiveInstitutionUnit>();
  const [isLoadingUnit, setIsLoadingUnit] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      setIsLoadingUnit(true);
      // TODO: NP-844 should ensure we have URIs from start (not IDs)
      const isSubunit = orgunitId.includes('.');
      const unitUri = isSubunit
        ? `${CRISTIN_UNITS_BASE_URL}${orgunitId}`
        : `${CRISTIN_INSTITUTIONS_BASE_URL}${orgunitId}`;
      const response = await getDepartment(unitUri);

      if (response?.error) {
        dispatch(setNotification(response.error, NotificationVariant.Error));
      } else {
        if (!isSubunit) {
          // Remove subunits from institution, since we only care about top-level in this case
          delete response.subunits;
        }
        setUnit(response);
      }
      setIsLoadingUnit(false);
    };

    fetchDepartment();
  }, [dispatch, orgunitId]);

  return (
    <StyledCard data-testid="institution-presentation">
      {isLoadingUnit ? (
        <Progress />
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
