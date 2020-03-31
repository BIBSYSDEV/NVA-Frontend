import React, { useState, FC } from 'react';
import Card from '../../components/Card';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './institution/InstitutionSelector';
import Heading from '../../components/Heading';
import { Formik, Field, FieldProps, Form } from 'formik';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import {
  emptyRecursiveUnit,
  emptyFormikUnit,
  FormikInstitutionUnitFieldNames,
  FormikInstitutionUnit,
} from '../../types/institution.types';
import { AuthorityQualifiers, updateQualifierIdForAuthority, addQualifierIdForAuthority } from '../../api/authorityApi';
import { setAuthorityData } from '../../redux/actions/userActions';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import InstitutionCardList from './institution/InstitutionCardList';

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
  const authority = useSelector((state: RootStore) => state.user.authority);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { t } = useTranslation('profile');
  const dispatch = useDispatch();

  const toggleOpen = () => {
    setOpen(!open);
  };

  const addOrgunitIdToAuthorityAndDispatchNotification = async (id: string, scn: string) => {
    const updatedAuthority = await addQualifierIdForAuthority(scn, AuthorityQualifiers.ORGUNIT_ID, id);
    if (updatedAuthority.error) {
      dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
    }
  };

  const handleAddInstitution = async ({ id, subunits }: FormikInstitutionUnit) => {
    try {
      if (authority) {
        if (subunits.length === 0) {
          await addOrgunitIdToAuthorityAndDispatchNotification(id, authority.systemControlNumber);
        } else {
          const lastSubunit = subunits.pop();
          await addOrgunitIdToAuthorityAndDispatchNotification(lastSubunit!.id, authority.systemControlNumber);
        }
      }
    } catch (error) {
      dispatch(setNotification(t('feedback:error.update_authority'), NotificationVariant.Error));
    }
  };

  const handleSubmit = async (values: FormikInstitutionUnit, { resetForm }: any) => {
    if (editMode && values.editId && authority) {
      const organizationUnitId = values.subunits.length > 0 ? values.subunits.pop()!.id : values.id;
      const updatedAuthority = await updateQualifierIdForAuthority(
        authority.systemControlNumber,
        AuthorityQualifiers.ORGUNIT_ID,
        values.editId,
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
    setEditMode(false);
  };

  const handleEdit = () => {
    setOpen(true);
    setEditMode(true);
  };

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      <Formik enableReinitialize initialValues={emptyFormikUnit} onSubmit={handleSubmit} validateOnChange={false}>
        <Form>
          {!editMode && <InstitutionCardList onEdit={handleEdit} open={open} />}
          <Field name={FormikInstitutionUnitFieldNames.UNIT}>
            {({ field: { name, value }, form: { values, setFieldValue, resetForm } }: FieldProps) => (
              <>
                {open && (
                  <StyledInstitutionSearchContainer>
                    <InstitutionSearch
                      dataTestId="autosearch-institution"
                      disabled={editMode}
                      label={t('organization.institution')}
                      clearSearchField={values.name === ''}
                      setValueFunction={(inputValue) => {
                        setFieldValue(FormikInstitutionUnitFieldNames.NAME, inputValue.name);
                        setFieldValue(FormikInstitutionUnitFieldNames.ID, inputValue.id);
                        setFieldValue(name, inputValue ?? emptyRecursiveUnit);
                      }}
                      placeholder={editMode ? values.name : t('organization.search_for_institution')}
                    />
                    {value && (
                      <>
                        <InstitutionSelector counter={0} unit={value} />
                        <StyledButton
                          variant="contained"
                          type="submit"
                          color="primary"
                          disabled={!value}
                          data-testid="institution-add-button">
                          {editMode ? t('common:edit') : t('common:add')}
                        </StyledButton>
                        <StyledButton
                          onClick={() => {
                            toggleOpen();
                            resetForm({});
                            setEditMode(false);
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
        </Form>
      </Formik>
      {!open && (
        <StyledButtonContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleOpen}
            disabled={!authority}
            data-testid="add-new-institution-button">
            {t('organization.add_institution')}
          </Button>
        </StyledButtonContainer>
      )}
    </Card>
  );
};

export default UserInstitution;
