import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { getDepartment } from '../../../api/institutionApi';
import Card from '../../../components/Card';
import NormalText from '../../../components/NormalText';
import { RecursiveInstitutionUnit } from '../../../types/institution.types';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import Label from '../../../components/Label';
import Progress from '../../../components/Progress';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { AuthorityQualifiers, removeQualifierIdFromAuthority } from '../../../api/authorityApi';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { CRISTIN_UNITS_BASE_URL, CRISTIN_INSTITUTIONS_BASE_URL } from '../../../utils/constants';

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

const StyledButtonProgressContainer = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
`;

interface InstitutionCardProps {
  orgunitId: string;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ orgunitId }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const authority = useSelector((state: RootStore) => state.user.authority);
  const [unit, setUnit] = useState<RecursiveInstitutionUnit>();
  const [isLoadingUnit, setIsLoadingUnit] = useState(false);
  const [isRemovingAffiliation, setIsRemovingAffiliation] = useState(false);

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

  const handleRemoveInstitution = async () => {
    if (!authority || !orgunitId) {
      return;
    }
    setIsRemovingAffiliation(true);
    const updatedAuthority = await removeQualifierIdFromAuthority(
      authority.systemControlNumber,
      AuthorityQualifiers.ORGUNIT_ID,
      orgunitId
    );
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
      dispatch(setNotification(t('feedback:success.delete_affiliation')));
    }
  };

  return (
    <StyledCard data-testid="institution-presentation">
      {isLoadingUnit ? (
        <Progress />
      ) : (
        <>
          <StyledTextContainer>
            <Label>{unit?.name}</Label>
            {unit?.subunits && <UnitRow unit={unit.subunits[0]} />}
          </StyledTextContainer>
          <StyledButtonContainer>
            <Button
              variant="outlined"
              color="secondary"
              data-testid={`button-delete-institution-${orgunitId}`}
              disabled={isRemovingAffiliation}
              onClick={handleRemoveInstitution}>
              <DeleteIcon />
              {t('remove')}
              {isRemovingAffiliation && (
                <StyledButtonProgressContainer>
                  <Progress size={15} thickness={5} />
                </StyledButtonProgressContainer>
              )}
            </Button>
          </StyledButtonContainer>
        </>
      )}
    </StyledCard>
  );
};

interface UnitRowProps {
  unit: RecursiveInstitutionUnit;
}

const UnitRow: FC<UnitRowProps> = ({ unit }) => {
  return (
    <>
      <NormalText>{unit.name}</NormalText>
      {unit.subunits && <UnitRow unit={unit.subunits[0]} />}
    </>
  );
};

export default InstitutionCard;
