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
  InstitutionUnit,
  emptyFormikUnit,
  FormikInstitutionUnitFieldNames,
  FormikInstitutionUnit,
} from '../../types/institution.types';
import { updateInstitutionForAuthority } from '../../api/authorityApi';
import { setAuthorityData } from '../../redux/actions/userActions';
import { addNotification } from '../../redux/actions/notificationActions';
import { getParentUnits } from '../../api/institutionApi';
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
  const [units, setUnits] = useState<InstitutionUnit[]>([]);
  const { t } = useTranslation('profile');
  const dispatch = useDispatch();

  useEffect(() => {
    const getUnitsForUser = async () => {
      let units: InstitutionUnit[] = [];
      for (let orgunitid in user.authority.orgunitids) {
        const currentSubunitid = user.authority.orgunitids[orgunitid];
        const unit = await getParentUnits(currentSubunitid);
        if (!unit.error) {
          units.push(unit);
        }
      }
      if (user.authority.orgunitids.length > 0 && units.length === 0) {
        dispatch(addNotification(t('feedback:error.get_parent_units'), 'error'));
      }
      setUnits(units);
    };
    if (user.authority.orgunitids?.length > 0) {
      getUnitsForUser();
    }
  }, [user.authority.orgunitids, dispatch, t]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const updateAuthorityAndDispatch = async (id: string, scn: string) => {
    const updatedAuthority = await updateInstitutionForAuthority(id, scn);
    if (updatedAuthority.error) {
      dispatch(addNotification(updatedAuthority.error, 'error'));
    } else if (updatedAuthority) {
      dispatch(setAuthorityData(updatedAuthority));
    }
  };

  const handleAddInstitution = async ({ name, id, subunits }: InstitutionUnit) => {
    try {
      if (subunits.length === 0) {
        await updateAuthorityAndDispatch(id, user.authority.systemControlNumber);
      } else {
        const lastSubunit = subunits.slice(-1)[0];
        await updateAuthorityAndDispatch(lastSubunit.id, user.authority.systemControlNumber);
      }
    } catch (error) {
      dispatch(addNotification(t('feedback:error.update_authority'), 'error'));
    }
    // TODO: remove this when we get data from backend
    const filteredSubunits = subunits.filter((subunit: InstitutionUnitBase) => subunit.name !== '');
    setUnits([...units, { id, name, subunits: filteredSubunits }]);

    setOpen(false);
  };

  const onSubmit = async (values: FormikInstitutionUnit, { resetForm }: any) => {
    handleAddInstitution({ name: values.name, id: values.id, subunits: values.subunits });
    resetForm(emptyFormikUnit);
  };

  return (
    <Card>
      <Heading>{t('heading.organizations')}</Heading>
      {units.length > 0 ? (
        units.map((unit: InstitutionUnit, index: number) => <InstitutionCard key={index} unit={unit} />)
      ) : (
        <>{!open && <NormalText>{t('organization.no_institutions_found')}</NormalText>}</>
      )}
      <Formik enableReinitialize initialValues={emptyFormikUnit} onSubmit={onSubmit} validateOnChange={false}>
        {({ values, setFieldValue, handleSubmit, resetForm }: FormikProps<FormikInstitutionUnit>) => (
          <Field name={FormikInstitutionUnitFieldNames.UNIT}>
            {({ field: { name, value } }: FieldProps) =>
              open && (
                <StyledInstitutionSearchContainer>
                  <InstitutionSearch
                    dataTestId="autosearch-institution"
                    label={t('organization.institution')}
                    clearSearchField={values.name === ''}
                    setValueFunction={inputValue => {
                      setFieldValue(FormikInstitutionUnitFieldNames.NAME, inputValue.name);
                      setFieldValue(FormikInstitutionUnitFieldNames.ID, inputValue.id);
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
                      <StyledButton
                        onClick={() => {
                          toggleOpen();
                          resetForm({});
                        }}
                        variant="contained"
                        color="secondary">
                        {t('common:cancel')}
                      </StyledButton>
                    </>
                  )}
                </StyledInstitutionSearchContainer>
              )
            }
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
