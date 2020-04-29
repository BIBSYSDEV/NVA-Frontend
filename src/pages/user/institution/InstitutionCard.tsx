import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
// import Label from '../../../components/Label';
// import { Button } from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';
// import { useTranslation } from 'react-i18next';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootStore } from '../../../redux/reducers/rootReducer';
// import { AuthorityQualifiers, removeQualifierIdFromAuthority } from '../../../api/authorityApi';
// import { setNotification } from '../../../redux/actions/notificationActions';
// import { NotificationVariant } from '../../../types/notification.types';
// import { setAuthorityData } from '../../../redux/actions/userActions';
// import NormalText from '../../../components/NormalText';
// import {
//   InstitutionUnitBase,
//   FormikInstitutionUnitFieldNames,
//   FormikInstitutionUnit,
// } from '../../../types/institution.types';
// import { FormikProps, useFormikContext } from 'formik';
import { getDepartment } from '../../../api/institutionApi';
import SubHeading from '../../../components/SubHeading';

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

// const StyledButtonContainer = styled.div`
//   grid-area: button;
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
// `;

// const StyledEditButton = styled(Button)`
//   margin-right: 0.5rem;
// `;

interface InstitutionCardProps {
  orgunitId: string;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ orgunitId }) => {
  // const authority = useSelector((state: RootStore) => state.user.authority);
  // const { t } = useTranslation('common');
  // const dispatch = useDispatch();
  const [unit, setUnit] = useState<any>();

  useEffect(() => {
    const fetchDepartment = async () => {
      const isSubunit = orgunitId.includes('.');
      const unitUri = isSubunit
        ? `https://api.cristin.no/v2/units/${orgunitId}`
        : `https://api.cristin.no/v2/institutions/${orgunitId}`;
      const response = await getDepartment(unitUri);
      try {
        const unit = JSON.parse(response.json);
        if (!isSubunit) {
          // Remove subunits from institution, since we only care about top-level in this case
          delete unit.subunits;
        }
        setUnit(unit);
      } catch {}
    };

    fetchDepartment();
  }, [orgunitId]);

  // const organizationUnitId = unit?.subunits && unit.subunits.length > 0 ? unit.subunits.slice(-1)[0].id : unit.id;
  // const { setFieldValue }: FormikProps<FormikInstitutionUnit> = useFormikContext();

  // const handleRemoveInstitution = async () => {
  //   if (!authority || !orgunitId) {
  //     return;
  //   }
  //   const updatedAuthority = await removeQualifierIdFromAuthority(
  //     authority.systemControlNumber,
  //     AuthorityQualifiers.ORGUNIT_ID,
  //     orgunitId
  //   );
  //   if (updatedAuthority.error) {
  //     dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
  //   } else if (updatedAuthority) {
  //     dispatch(setAuthorityData(updatedAuthority));
  //     dispatch(setNotification(t('feedback:success.delete_identifier')));
  //   }
  // };

  // const handleEditInstitution = async () => {
  //   // onEdit();
  //   setFieldValue(FormikInstitutionUnitFieldNames.ID, unit.id);
  //   setFieldValue(FormikInstitutionUnitFieldNames.NAME, unit.name);
  //   setFieldValue(FormikInstitutionUnitFieldNames.SUBUNITS, unit.subunits);
  //   setFieldValue(FormikInstitutionUnitFieldNames.UNIT, unit.unit);
  //   setFieldValue(FormikInstitutionUnitFieldNames.EDIT_ID, organizationUnitId);
  // };
  // console.log(orgunitId, unit);
  return (
    <StyledSelectedInstitution data-testid="institution-presentation">
      <StyledTextContainer>
        <SubHeading>{unit?.name}</SubHeading>
        {unit?.subunits && <UnitRow unit={unit.subunits[0]} />}
      </StyledTextContainer>

      {/* <StyledTextContainer>
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
      </StyledButtonContainer> */}
    </StyledSelectedInstitution>
  );
};

const UnitRow: FC<any> = ({ unit }) => {
  return (
    <>
      <p>{unit.name}</p>
      {unit.subunits && <UnitRow unit={unit.subunits[0]} />}
    </>
  );
};

export default InstitutionCard;
