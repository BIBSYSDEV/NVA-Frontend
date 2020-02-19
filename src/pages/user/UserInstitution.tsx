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
import { emptyUnit, Unit, Subunit, UserUnit, emptyFormikUnitState } from '../../types/institution.types';

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
  const [units, setUnits] = useState<UserUnit[]>([]);
  const { t } = useTranslation('profile');

  const handleClickAdd = () => {
    setOpen(true);
  };

  const handleAddInstitution = (unit: Subunit, subunits: Subunit[]) => {
    const filteredSubunits = subunits.filter((u: Subunit) => u.name !== '');
    console.log('filtered', filteredSubunits);
    console.log('unit', unit);
    setUnits([...units, { id: unit.id, name: unit.name, subunits: filteredSubunits }]);
    // TODO: find which is the lower subunit to be saved in ARP
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      {units && units.map((unit: UserUnit) => <InstitutionCard key={unit.id} unit={unit} />)}
      <Formik
        enableReinitialize
        initialValues={emptyFormikUnitState}
        onSubmit={(values: any) => {
          console.log(values);
        }}
        validateOnChange={false}>
        {({ values, setFieldValue, handleReset, handleSubmit }: FormikProps<any>) => (
          <>
            <Field name="unit">
              {({ field: { name, value } }: any) => (
                <>
                  {open && (
                    <StyledInstitutionSearchContainer>
                      <InstitutionSearch
                        dataTestId="autosearch-institution"
                        label={t('organization.institution')}
                        clearSearchField={values.name === ''}
                        setValueFunction={inputValue => {
                          setFieldValue('name', inputValue.name);
                          setFieldValue('id', inputValue.id);
                          setFieldValue(name, inputValue ?? emptyUnit);
                        }}
                        placeholder={t('organization.search_for_institution')}
                        disabled={false}
                      />
                      {values.unit && (
                        <>
                          <InstitutionSelector counter={0} unit={value} />
                          <StyledButton
                            onClick={() => {
                              handleAddInstitution({ name: values.name, id: values.id }, values.subunits);
                              handleReset();
                            }}
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={!values.unit}
                            data-testid="institution-add-button">
                            {t('common:add')}
                          </StyledButton>
                          <StyledButton onClick={handleCancel} variant="contained" color="secondary">
                            {t('common:cancel')}
                          </StyledButton>
                        </>
                      )}
                    </StyledInstitutionSearchContainer>
                  )}
                </>
              )}
            </Field>
          </>
        )}
      </Formik>
      {!open && (
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
      )}
    </Card>
  );
};

export default UserInstitution;
