import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { AuthorityQualifiers, updateQualifierIdForAuthority } from '../../../api/authorityApi';
import { Card } from '../../../components/Card';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { EditInstitution } from '../../../components/institution/EditInstitution';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/actions/notificationActions';
import { setAuthorityData } from '../../../redux/actions/userActions';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { FormikInstitutionUnit } from '../../../types/institution.types';
import { NotificationVariant } from '../../../types/notification.types';
import { getMostSpecificUnit } from '../../../utils/institutions-helpers';
import { DangerButton } from '../../../components/DangerButton';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';

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
  orgunitId: string;
  setInstitutionIdToRemove: (orgunitId: string) => void;
}

export const InstitutionCard = ({ orgunitId, setInstitutionIdToRemove }: InstitutionCardProps) => {
  const { t } = useTranslation('common');
  const [openEditForm, setOpenEditForm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootStore) => store);

  const handleEditInstitution = async (values: FormikInstitutionUnit, initialInstitution: string) => {
    if (!values.unit || !user?.authority) {
      return;
    }

    const mostSpecificUnit = getMostSpecificUnit(values.unit);
    const newUnitId = mostSpecificUnit.id;

    if (!newUnitId) {
      return;
    } else if (user.authority.orgunitids.includes(newUnitId)) {
      dispatch(setNotification(t('feedback:info.affiliation_already_exists'), NotificationVariant.Info));
      return;
    }

    const updateAuthorityResponse = await updateQualifierIdForAuthority(
      user.authority.id,
      AuthorityQualifiers.OrgUnitId,
      initialInstitution,
      newUnitId
    );
    if (isErrorStatus(updateAuthorityResponse.status)) {
      dispatch(
        setNotification(
          t('feedback:error.update_authority', { qualifier: t(`common:${AuthorityQualifiers.OrgUnitId}`) }),
          NotificationVariant.Error
        )
      );
    } else if (isSuccessStatus(updateAuthorityResponse.status)) {
      dispatch(setAuthorityData(updateAuthorityResponse.data));
      dispatch(setNotification(t('feedback:success.added_affiliation')));
    }
  };

  return openEditForm ? (
    <Card>
      <EditInstitution
        initialInstitutionId={orgunitId}
        onSubmit={(values) => handleEditInstitution(values, orgunitId)}
        onCancel={() => setOpenEditForm(false)}
      />
    </Card>
  ) : (
    <StyledCard data-testid="institution-presentation">
      <StyledTextContainer>
        <AffiliationHierarchy unitUri={orgunitId} />
      </StyledTextContainer>
      <StyledButtonContainer>
        <Button
          variant="outlined"
          color="primary"
          data-testid={`button-edit-institution-${orgunitId}`}
          startIcon={<EditIcon />}
          onClick={() => setOpenEditForm(true)}>
          {t('edit')}
        </Button>
        <DangerButton
          variant="outlined"
          color="secondary"
          data-testid={`button-delete-institution-${orgunitId}`}
          startIcon={<DeleteIcon />}
          onClick={() => setInstitutionIdToRemove(orgunitId)}>
          {t('remove')}
        </DangerButton>
      </StyledButtonContainer>
    </StyledCard>
  );
};
