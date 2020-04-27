import React, { FC, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, Form } from 'formik';

import {
  FormikInstitutionUnit,
  FormikInstitutionUnitFieldNames,
  InstitutionUnitBase,
  RecursiveInstitutionUnit,
} from '../types/institution.types';
import InstitutionSelector from '../pages/user/institution/InstitutionSelector';
import { useDispatch } from 'react-redux';
import { getInstitutions, getDepartment } from '../api/institutionApi';
import { setNotification } from '../redux/actions/notificationActions';
import { NotificationVariant } from '../types/notification.types';
// import { filterInstitutions } from '../utils/institutions-helpers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Progress from './Progress';

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
  excludeAffiliationIds?: string[];
}

const SelectInstitution: FC<SelectInstitutionProps> = ({ onSubmit, onClose, excludeAffiliationIds }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [institutions, setInstitutions] = useState<InstitutionUnitBase[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<RecursiveInstitutionUnit[]>();
  const [fetchingDepartment, setFetchingDepartment] = useState(false);

  useEffect(() => {
    // TODO: This only needs to be done once (not for each SelectInstitution)
    const fetchInstitutions = async () => {
      const response = await getInstitutions();
      if (response?.error) {
        dispatch(setNotification(response.error, NotificationVariant.Error));
      } else {
        const relevantInstitutions = excludeAffiliationIds // TODO: revisit use of excludeAffiliationIds
          ? response.filter((institution: any) => !excludeAffiliationIds.includes(institution.id))
          : response;
        setInstitutions(relevantInstitutions);
      }
    };
    fetchInstitutions();
  }, [dispatch, excludeAffiliationIds]);

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
          {({ field: { name, value }, form: { values, setFieldValue, resetForm } }: FieldProps) => (
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
