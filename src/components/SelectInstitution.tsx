import React, { FC, useEffect, useState } from 'react';
import { Button, TextField, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, Form } from 'formik';

import {
  FormikInstitutionUnit,
  FormikInstitutionUnitFieldNames,
  RecursiveInstitutionUnit,
} from '../types/institution.types';
import InstitutionSelector from '../pages/user/institution/InstitutionSelector';
import { useDispatch, useSelector } from 'react-redux';
import { getInstitutions, getDepartment } from '../api/institutionApi';
import { setNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Progress from './Progress';
import { RootStore } from '../redux/reducers/rootReducer';
import { setInstitutions } from '../redux/actions/institutionActions';

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
`;

const StyledProgress = styled(Progress)`
  display: block;
  margin: 1rem;
`;

interface SelectInstitutionProps {
  onSubmit: (values: FormikInstitutionUnit) => void;
  onClose?: () => void;
}

const SelectInstitution: FC<SelectInstitutionProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const institutions = useSelector((store: RootStore) => store.institutions);
  const [selectedInstitution, setSelectedInstitution] = useState<RecursiveInstitutionUnit[]>();
  const [fetchingInstitutions, setFetchingInstitutions] = useState(false);
  const [fetchingDepartment, setFetchingDepartment] = useState(false);

  useEffect(() => {
    const fetchInstitutions = async () => {
      setFetchingInstitutions(true);
      const response = await getInstitutions();
      if (response?.error) {
        dispatch(setNotification(response.error, NotificationVariant.Error));
      } else {
        dispatch(setInstitutions(response));
      }
      setFetchingInstitutions(false);
    };
    // Institutions should not change, so ensure we fetch only once
    if (!institutions || institutions.length === 0) {
      fetchInstitutions();
    }
  }, [dispatch, institutions]);

  const fetchDepartment = async (institutionId: string) => {
    setFetchingDepartment(true);
    const response = await getDepartment(institutionId);
    setFetchingDepartment(false);
    if (!response || response.error) {
      dispatch(setNotification(response.error, NotificationVariant.Error));
      return;
    }
    const subunits = JSON.parse(response.json).subunits;
    setSelectedInstitution(subunits);
  };

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      <Form>
        <Field name={FormikInstitutionUnitFieldNames.UNIT}>
          {({ field: { name, value }, form: { setFieldValue, resetForm } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <Autocomplete
                options={institutions}
                getOptionLabel={(option: RecursiveInstitutionUnit) => option.name}
                noOptionsText={t('common:no_hits')}
                onChange={(_: any, value: any) => {
                  setSelectedInstitution(undefined);
                  if (value) {
                    fetchDepartment(value.id);
                  }
                  setFieldValue(name, value);
                }}
                renderInput={(params) => (
                  <TextField
                    // inputProps={{ 'data-testid': 'autosearch-institution' }}
                    {...params}
                    label={t('common:institution.institution')}
                    placeholder={t('common:institution.search_institution')}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {fetchingInstitutions && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {fetchingDepartment && <StyledProgress />}

              {selectedInstitution && <InstitutionSelector unit={selectedInstitution} fieldNamePrefix={name} />}

              <StyledButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={!value || fetchingDepartment}
                data-testid="institution-add-button">
                {t('common:add')}
              </StyledButton>

              {onClose && (
                <StyledButton
                  onClick={() => {
                    resetForm({});
                    onClose();
                  }}
                  variant="contained">
                  {t('common:cancel')}
                </StyledButton>
              )}
            </StyledInstitutionSearchContainer>
          )}
        </Field>
      </Form>
    </Formik>
  );
};

export default SelectInstitution;
