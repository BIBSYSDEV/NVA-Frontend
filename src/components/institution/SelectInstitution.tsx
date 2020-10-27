import React, { FC } from 'react';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, Form } from 'formik';

import { FormikInstitutionUnit, FormikInstitutionUnitFieldNames } from '../../types/institution.types';
import InstitutionSelector from '../../pages/user/institution/InstitutionSelector';
import useFetchInstitutions from '../../utils/hooks/useFetchInstitutions';
import InstitutionAutocomplete from './InstitutionAutocomplete';
import useFetchDepartments from '../../utils/hooks/useFetchDepartments';

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
`;

const StyledLoadingInfo = styled.div`
  margin: 1rem;
`;

interface SelectInstitutionProps {
  onSubmit: (values: FormikInstitutionUnit) => void;
  onClose?: () => void;
}

const SelectInstitution: FC<SelectInstitutionProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation('common');
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();
  const [subunits, isLoadingSubunits, fetchSubunits] = useFetchDepartments();

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
                  fetchSubunits(value?.id);
                  setFieldValue(name, value);
                }}
              />

              {isLoadingSubunits && (
                <StyledLoadingInfo>
                  <Typography>{t('institution:loading_department')}</Typography>
                  <CircularProgress />
                </StyledLoadingInfo>
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

export default SelectInstitution;
