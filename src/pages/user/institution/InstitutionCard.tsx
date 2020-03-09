import React, { FC } from 'react';
import styled from 'styled-components';
import Label from '../../../components/Label';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from '../../../redux/reducers/rootReducer';
import { AuthorityQualifiers, removeIdFromAuthority } from '../../../api/authorityApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../types/notification.types';
import { setAuthorityData } from '../../../redux/actions/userActions';
import NormalText from '../../../components/NormalText';
import {
  InstitutionUnitBase,
  FormikInstitutionUnitFieldNames,
  FormikInstitutionUnit,
} from '../../../types/institution.types';
import { FormikProps, useFormikContext } from 'formik';

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

const StyledButtonContainer = styled.div`
  grid-area: button;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const StyledEditButton = styled(Button)`
  margin-right: 0.5rem;
`;

interface InstitutionCardProps {
  onEdit: () => void;
  unit: FormikInstitutionUnit;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ onEdit, unit }) => {
  const { t } = useTranslation('common');
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();
  const organizationUnitId = unit.subunits.length > 0 ? unit.subunits.slice(-1)[0].id : unit.id;
  const { setFieldValue }: FormikProps<FormikInstitutionUnit> = useFormikContext();

  const handleRemoveInstitution = async () => {
    const updatedAuthority = await removeIdFromAuthority(
      user.authority.systemControlNumber,
      AuthorityQualifiers.ORGUNIT_ID,
      organizationUnitId
    );
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
      dispatch(setNotification(t('feedback:success.delete_identifier')));
    }
  };

  const handleEditInstitution = async () => {
    onEdit();
    setFieldValue(FormikInstitutionUnitFieldNames.ID, unit.id);
    setFieldValue(FormikInstitutionUnitFieldNames.NAME, unit.name);
    setFieldValue(FormikInstitutionUnitFieldNames.SUBUNITS, unit.subunits);
    setFieldValue(FormikInstitutionUnitFieldNames.UNIT, unit.unit);
    setFieldValue(FormikInstitutionUnitFieldNames.EDIT_ID, organizationUnitId);
  };

  return (
    <StyledSelectedInstitution data-testid="institution-presentation">
      <StyledTextContainer>
        <Label>{unit.name}</Label>
        {unit.subunits?.map((subunit: InstitutionUnitBase) => (
          <NormalText key={subunit.id} data-testid="institution-presentation-subunit">
            {subunit.name}
          </NormalText>
        ))}
      </StyledTextContainer>
      <StyledButtonContainer>
        <StyledEditButton
          color="primary"
          data-testid={`button-edit-institution-${organizationUnitId}`}
          onClick={handleEditInstitution}>
          <EditIcon />
          {t('edit')}
        </StyledEditButton>
        <Button
          color="secondary"
          data-testid={`button-delete-institution-${organizationUnitId}`}
          onClick={handleRemoveInstitution}>
          <DeleteIcon />
          {t('remove')}
        </Button>
      </StyledButtonContainer>
    </StyledSelectedInstitution>
  );
};

export default InstitutionCard;
