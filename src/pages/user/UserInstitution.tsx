import React, { useState, useEffect, FC } from 'react';
import Card from '../../components/Card';
import InstitutionCard from './institution/InstitutionCard';
import { Button, FormControl, Select, MenuItem } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './institution/InstitutionSelector';
import Heading from '../../components/Heading';
import { Formik, FormikProps, Form, Field } from 'formik';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import { emptyUnit, Unit } from '../../types/institution.types';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

const UserInstitution: FC = () => {
  // Create Formik Form here App.tsx
  const user = useSelector((state: RootStore) => state.user);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('profile');

  const handleClickAdd = () => {
    setOpen(true);
  };

  const saveChanges = (values: any) => {
    console.log('save', values);
  };

  const handleAddInstitution = () => {};

  const handleCancel = () => {};

  const initialValues: Unit = emptyUnit;

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values: any) => saveChanges(values)}
        validateOnChange={false}>
        {({ values, setFieldValue }: FormikProps<any>) => (
          <>
            <Field name="institution">
              {({ field: { name, value } }: any) => (
                <>
                  <InstitutionCard />
                  <FormControl>
                    <InstitutionSearch
                      dataTestId="autosearch-institution"
                      label={t('organization.institution')}
                      clearSearchField={values.name === ''}
                      setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyUnit)}
                      placeholder={t('organization.search_for_institution')}
                      disabled={false}
                    />
                  </FormControl>
                  {values.institution && (
                    <>
                      <InstitutionSelector counter={0} unit={value} />
                      <StyledButton
                        onClick={handleAddInstitution}
                        variant="contained"
                        color="primary"
                        disabled={!values.selectedInstitution}
                        data-testid="institution-add-button">
                        {t('common:add')}
                      </StyledButton>
                      <StyledButton onClick={handleCancel} variant="contained" color="secondary">
                        {t('common:cancel')}
                      </StyledButton>
                    </>
                  )}
                </>
              )}
            </Field>
          </>
        )}
      </Formik>
      <StyledButtonContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickAdd}
          disabled={!user.authority?.systemControlNumber}
          data-testid="add-new-institution-button">
          {t('organization.add_institution')}
        </Button>
      </StyledButtonContainer>
    </Card>
  );
};

export default UserInstitution;
