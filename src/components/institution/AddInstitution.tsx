import { Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { InstitutionSelector } from '../../pages/user/institution/InstitutionSelector';
import { FormikInstitutionUnit, FormikInstitutionUnitFieldNames } from '../../types/institution.types';
import { useFetchDepartment } from '../../utils/hooks/useFetchDepartment';
import { useFetchInstitutions } from '../../utils/hooks/useFetchInstitutions';
import { InstitutionAutocomplete } from './InstitutionAutocomplete';

export const StyledButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface AddInstitutionProps {
  onSubmit: (values: FormikInstitutionUnit) => void;
  onClose?: () => void;
}

export const AddInstitution = ({ onSubmit, onClose }: AddInstitutionProps) => {
  const { t } = useTranslation('common');
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [department, isLoadingDepartment] = useFetchDepartment(selectedInstitutionId);

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      <Form noValidate>
        <Field name={FormikInstitutionUnitFieldNames.Unit}>
          {({ field: { name, value }, form: { setFieldValue, isSubmitting } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <InstitutionAutocomplete
                id={name}
                institutions={institutions}
                isLoading={isLoadingInstitutions}
                required
                value={value}
                onChange={(value) => {
                  setSelectedInstitutionId(value?.id ?? '');
                  setFieldValue(name, value);
                }}
              />
              {isLoadingDepartment && (
                <div>
                  <Typography>{t('institution:loading_department')}</Typography>
                  <CircularProgress />
                </div>
              )}

              {department?.subunits && department.subunits.length > 0 && (
                <InstitutionSelector
                  units={department.subunits}
                  fieldNamePrefix={name}
                  label={t('institution:department')}
                />
              )}

              <StyledButtonContainer>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                  disabled={!value || isLoadingDepartment}
                  data-testid="institution-add-button">
                  {t('add')}
                </LoadingButton>

                {onClose && (
                  <Button
                    onClick={() => {
                      onClose();
                    }}
                    data-testid="institution-cancel-button">
                    {t('cancel')}
                  </Button>
                )}
              </StyledButtonContainer>
            </StyledInstitutionSearchContainer>
          )}
        </Field>
      </Form>
    </Formik>
  );
};
