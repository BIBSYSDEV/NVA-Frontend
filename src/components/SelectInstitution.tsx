import React, { FC, useEffect, useState, ChangeEvent } from 'react';
import { Button, TextField, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, Form } from 'formik';

import {
  FormikInstitutionUnit,
  FormikInstitutionUnitFieldNames,
  RecursiveInstitutionUnit,
  InstitutionUnitBase,
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
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const institutions = useSelector((store: RootStore) => store.institutions);
  const [selectedInstitutionSubunits, setSelectedInstitutionSubunits] = useState<RecursiveInstitutionUnit[]>();
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(false);

  useEffect(() => {
    const fetchInstitutions = async () => {
      setIsLoadingInstitutions(true);
      const response = await getInstitutions();
      if (response?.error) {
        dispatch(setNotification(response.error, NotificationVariant.Error));
      } else {
        dispatch(setInstitutions(response));
      }
      setIsLoadingInstitutions(false);
    };
    // Institutions should not change, so ensure we fetch only once
    if (!institutions || institutions.length === 0) {
      fetchInstitutions();
    }
  }, [dispatch, institutions]);

  const fetchDepartment = async (institutionId: string) => {
    setIsLoadingDepartment(true);
    const response = await getDepartment(institutionId);
    // TODO: Cancel request when changing institution (NP-837)
    if (!response || response.error) {
      dispatch(setNotification(response.error, NotificationVariant.Error));
    } else {
      const subunits = JSON.parse(response.json).subunits;
      setSelectedInstitutionSubunits(subunits);
    }
    setIsLoadingDepartment(false);
  };

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      <Form>
        <Field name={FormikInstitutionUnitFieldNames.UNIT}>
          {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <Autocomplete
                options={institutions}
                getOptionLabel={(option: RecursiveInstitutionUnit) => option.name}
                noOptionsText={t('no_hits')}
                onChange={(_: ChangeEvent<{}>, value: InstitutionUnitBase | null) => {
                  setSelectedInstitutionSubunits(undefined);
                  if (value) {
                    fetchDepartment(value.id);
                  } else {
                    setIsLoadingDepartment(false);
                  }
                  setFieldValue(name, value);
                }}
                renderInput={(params) => (
                  <TextField
                    // inputProps={{ 'data-testid': 'autosearch-institution' }}
                    {...params}
                    label={t('institution')}
                    placeholder={t('institution:search_institution')}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingInstitutions && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {isLoadingDepartment && <StyledProgress />}

              {selectedInstitutionSubunits && (
                <InstitutionSelector units={selectedInstitutionSubunits} fieldNamePrefix={name} />
              )}

              <StyledButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={!value || isLoadingDepartment}
                data-testid="institution-add-button">
                {t('add')}
              </StyledButton>

              {onClose && (
                <StyledButton
                  onClick={() => {
                    onClose();
                  }}
                  variant="contained">
                  {t('cancel')}
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
