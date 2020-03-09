import React, { useState, FC, useEffect } from 'react';
import Card from '../../components/Card';
import InstitutionCard from './institution/InstitutionCard';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './institution/InstitutionSelector';
import Heading from '../../components/Heading';
import { Formik, FormikProps, Field, FieldProps } from 'formik';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import {
  emptyRecursiveUnit,
  InstitutionUnitBase,
  emptyFormikUnit,
  FormikInstitutionUnitFieldNames,
  FormikInstitutionUnit,
} from '../../types/institution.types';
import { AuthorityQualifiers, updateQualifierIdForAuthority, addQualifierIdForAuthority } from '../../api/authorityApi';
import { setAuthorityData } from '../../redux/actions/userActions';
import { setNotification } from '../../redux/actions/notificationActions';
import { getParentUnits } from '../../api/institutionApi';
import { NotificationVariant } from '../../types/notification.types';
import NormalText from '../../components/NormalText';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
`;

const UserInstitution: FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState<FormikInstitutionUnit[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const { t } = useTranslation('profile');
  const dispatch = useDispatch();

  useEffect(() => {
    const getUnitsForUser = async () => {
      let units: FormikInstitutionUnit[] = [];
      for (let orgunitid in user.authority.orgunitids) {
        const currentSubunitid = user.authority.orgunitids[orgunitid];
        const unit = await getParentUnits(currentSubunitid);
        if (!unit.error) {
          units.push(unit);
        }
      }
      if (user.authority.orgunitids.length > 0 && units.length === 0) {
        dispatch(setNotification(t('feedback:error.get_parent_units'), NotificationVariant.Error));
      }
      setUnits(units);
    };
    if (user.authority.orgunitids?.length > 0) {
      getUnitsForUser();
    } else {
      setUnits([]);
    }
  }, [user.authority.orgunitids, dispatch, t]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const addOrgunitIdToAuthorityAndDispatch = async (id: string, scn: string) => {
    const updatedAuthority = await addQualifierIdForAuthority(scn, AuthorityQualifiers.ORGUNIT_ID, id);
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
    }
  };

  const handleAddInstitution = async ({ name, id, subunits, unit }: FormikInstitutionUnit) => {
    try {
      if (subunits.length === 0) {
        await addOrgunitIdToAuthorityAndDispatch(id, user.authority.systemControlNumber);
      } else {
        const lastSubunit = subunits.slice(-1)[0];
        await addOrgunitIdToAuthorityAndDispatch(lastSubunit.id, user.authority.systemControlNumber);
      }
    } catch (error) {
      dispatch(setNotification(t('feedback:error.update_authority'), NotificationVariant.Error));
    }
    // TODO: remove this when we get data from backend
    const filteredSubunits = subunits.filter((subunit: InstitutionUnitBase) => subunit.name !== '');
    setUnits([...units, { id, name, subunits: filteredSubunits, unit }]);
  };

  const onSubmit = async (values: FormikInstitutionUnit, { resetForm }: any) => {
    if (openEdit) {
      const organizationUnitId = values.subunits.length > 0 ? values.subunits.slice(-1)[0].id : values.id;
      const updatedAuthority = await updateQualifierIdForAuthority(
        user.authority.systemControlNumber,
        AuthorityQualifiers.ORGUNIT_ID,
        values.editId!,
        organizationUnitId
      );
      if (updatedAuthority.error) {
        dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
      } else if (updatedAuthority) {
        dispatch(setAuthorityData(updatedAuthority));
        dispatch(setNotification(t('feedback:success.update_identifier')));
      }
    } else {
      await handleAddInstitution({
        name: values.name,
        id: values.id,
        subunits: values.subunits,
        unit: values.unit,
      });
      resetForm(emptyFormikUnit);
    }
    setOpen(false);
    setOpenEdit(false);
  };

  const handleEdit = () => {
    setOpen(true);
    setOpenEdit(true);
  };

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      <Formik enableReinitialize initialValues={emptyFormikUnit} onSubmit={onSubmit} validateOnChange={false}>
        {({ values, setFieldValue, handleSubmit, resetForm }: FormikProps<FormikInstitutionUnit>) => (
          <Field name={FormikInstitutionUnitFieldNames.UNIT}>
            {({ field: { name, value } }: FieldProps) => (
              <>
                {!openEdit && units.length > 0 ? (
                  units.map((unit: FormikInstitutionUnit, index: number) => (
                    <InstitutionCard key={index} unit={unit} onEdit={handleEdit} />
                  ))
                ) : (
                  <>{!open && <NormalText>{t('organization.no_institutions_found')}</NormalText>}</>
                )}
                {open && (
                  <StyledInstitutionSearchContainer>
                    <InstitutionSearch
                      dataTestId="autosearch-institution"
                      disabled={openEdit}
                      label={t('organization.institution')}
                      clearSearchField={values.name === ''}
                      setValueFunction={inputValue => {
                        setFieldValue(FormikInstitutionUnitFieldNames.NAME, inputValue.name);
                        setFieldValue(FormikInstitutionUnitFieldNames.ID, inputValue.id);
                        setFieldValue(name, inputValue ?? emptyRecursiveUnit);
                      }}
                      placeholder={openEdit ? values.name : t('organization.search_for_institution')}
                    />
                    {values.unit && (
                      <>
                        <InstitutionSelector counter={0} unit={value} />
                        <StyledButton
                          onClick={() => handleSubmit()}
                          variant="contained"
                          type="submit"
                          color="primary"
                          disabled={!values.unit}
                          data-testid="institution-add-button">
                          {openEdit ? t('common:edit') : t('common:add')}
                        </StyledButton>
                        <StyledButton
                          onClick={() => {
                            toggleOpen();
                            resetForm({});
                            setOpenEdit(false);
                          }}
                          variant="contained"
                          color="secondary">
                          {t('common:cancel')}
                        </StyledButton>
                      </>
                    )}
                  </StyledInstitutionSearchContainer>
                )}
              </>
            )}
          </Field>
        )}
      </Formik>
      {!open && (
        <StyledButtonContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleOpen}
            disabled={!user.authority?.systemControlNumber}
            data-testid="add-new-institution-button">
            {t('organization.add_institution')}
          </Button>
        </StyledButtonContainer>
      )}
    </Card>
  );
};

export default UserInstitution;
