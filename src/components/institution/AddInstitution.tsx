import { Field, FieldProps, Form, Formik } from 'formik';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import InstitutionSelector from '../../pages/user/institution/InstitutionSelector';
import { FormikInstitutionUnit, FormikInstitutionUnitFieldNames } from '../../types/institution.types';
import useFetchDepartments from '../../utils/hooks/useFetchDepartments';
import useFetchInstitutions from '../../utils/hooks/useFetchInstitutions';
import InstitutionAutocomplete from './InstitutionAutocomplete';

const StyledButton = styled(Button)`
  margin: 0.5rem 0.5rem 0 0;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
`;

interface AddInstitutionProps {
  onSubmit: (values: FormikInstitutionUnit) => void;
  onClose?: () => void;
}

const AddInstitution: FC<AddInstitutionProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation('common');
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [subunits, isLoadingSubunits] = useFetchDepartments(selectedInstitutionId);

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      <Form>
        <Field name={FormikInstitutionUnitFieldNames.UNIT}>
          {({ field: { name, value }, form: { setFieldValue, isSubmitting } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <InstitutionAutocomplete
                institutions={institutions}
                isLoading={isLoadingInstitutions}
                value={value}
                onChange={(value) => {
                  setSelectedInstitutionId(value?.id ?? '');
                  setFieldValue(name, value);
                }}
              />
              {isLoadingSubunits && (
                <div>
                  <Typography>{t('institution:loading_department')}</Typography>
                  <CircularProgress />
                </div>
              )}

              {subunits.length > 0 && (
                <InstitutionSelector units={subunits} fieldNamePrefix={name} label={t('institution:department')} />
              )}

              <StyledButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={!value || isLoadingSubunits || isSubmitting}
                data-testid="institution-add-button">
                {t('add')}
              </StyledButton>

              {onClose && (
                <StyledButton
                  onClick={() => {
                    onClose();
                  }}
                  data-testid="institution-cancel-button"
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

export default AddInstitution;
