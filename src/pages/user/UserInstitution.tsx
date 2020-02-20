import React, { useState, FC } from 'react';
import Card from '../../components/Card';
import InstitutionCard from './institution/InstitutionCard';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootStore } from './../../redux/reducers/rootReducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './institution/InstitutionSelector';
import Heading from '../../components/Heading';
import { Formik, FormikProps, Field } from 'formik';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import {
  emptyRecursiveUnit,
  Subunit,
  Unit,
  emptyFormikUnitState,
  FormikUnitFieldNames,
  FormikUnit,
} from '../../types/institution.types';

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
  const [units, setUnits] = useState<Unit[]>([]);
  const { t } = useTranslation('profile');

  const handleClickAdd = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAddInstitution = ({ name, id, subunits }: Unit) => {
    // TODO: find which is the lower subunit to be saved in ARP
    // try {
    //   // update ARP
    // } catch (error) {
    //   // handle error
    // }
    const filteredSubunits = subunits.filter((u: Subunit) => u.name !== '');
    setUnits([...units, { id, name, subunits: filteredSubunits }]);
    setOpen(false);
  };

  const onSubmit = async (values: FormikUnit, { resetForm }: any) => {
    handleAddInstitution({ name: values.name, id: values.id, subunits: values.subunits });
    resetForm({});
  };

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      {units && units.map((unit: Unit, index: number) => <InstitutionCard key={index} unit={unit} />)}
      <Formik enableReinitialize initialValues={emptyFormikUnitState} onSubmit={onSubmit} validateOnChange={false}>
        {({ values, setFieldValue, handleSubmit }: FormikProps<FormikUnit>) => (
          <>
            <Field name={FormikUnitFieldNames.UNIT}>
              {({ field: { name, value } }: any) => (
                <>
                  {open && (
                    <StyledInstitutionSearchContainer>
                      <InstitutionSearch
                        dataTestId="autosearch-institution"
                        label={t('organization.institution')}
                        clearSearchField={values.name === ''}
                        setValueFunction={inputValue => {
                          setFieldValue(FormikUnitFieldNames.NAME, inputValue.name);
                          setFieldValue(FormikUnitFieldNames.ID, inputValue.id);
                          setFieldValue(name, inputValue ?? emptyRecursiveUnit);
                        }}
                        placeholder={t('organization.search_for_institution')}
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
