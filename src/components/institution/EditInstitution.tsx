import { Field, FieldProps, Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import InstitutionSelector from '../../pages/user/institution/InstitutionSelector';
import { FormikInstitutionUnit, FormikInstitutionUnitFieldNames } from '../../types/institution.types';
import { useFetchDepartment } from '../../utils/hooks/useFetchDepartment';
import { useFetchInstitutions } from '../../utils/hooks/useFetchInstitutions';
import { convertToInstitution } from '../../utils/institutions-helpers';
import InstitutionAutocomplete from './InstitutionAutocomplete';
import { StyledButtonContainer } from './AddInstitution';
import ButtonWithProgress from '../ButtonWithProgress';

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
`;

interface EditInstitutionProps {
  initialInstitutionId: string;
  onCancel: () => void;
  onSubmit: (values: FormikInstitutionUnit) => void;
}

const EditInstitution: FC<EditInstitutionProps> = ({ initialInstitutionId, onCancel, onSubmit }) => {
  const { t } = useTranslation('common');
  const [institutions, isLoadingInstitutions] = useFetchInstitutions();
  const [department, isLoadingDepartment] = useFetchDepartment(convertToInstitution(initialInstitutionId));
  const initialInstitution = institutions.filter(
    (institution) => institution.id === convertToInstitution(initialInstitutionId)
  );
  const initialValue = initialInstitution.pop();

  return (
    <Formik enableReinitialize initialValues={{ unit: initialValue }} onSubmit={onSubmit}>
      <Form noValidate>
        <Field name={FormikInstitutionUnitFieldNames.UNIT}>
          {({ field: { name, value }, form: { isSubmitting } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <InstitutionAutocomplete
                id={name}
                institutions={initialInstitution}
                isLoading={isLoadingInstitutions}
                disabled
                value={value}
                required
              />

              {institutions.length > 0 && isLoadingDepartment && (
                <div>
                  <Typography>{t('institution:loading_department')}</Typography>
                  <CircularProgress />
                </div>
              )}

              {institutions.length > 0 && department?.subunits && department.subunits.length > 0 && (
                <InstitutionSelector
                  units={department.subunits}
                  fieldNamePrefix={name}
                  label={t('institution:department')}
                />
              )}

              <StyledButtonContainer>
                <ButtonWithProgress
                  variant="contained"
                  type="submit"
                  color="primary"
                  startIcon={<SaveIcon />}
                  isLoading={isSubmitting}
                  disabled={isLoadingDepartment}
                  data-testid="institution-edit-button">
                  {t('save')}
                </ButtonWithProgress>

                <Button onClick={onCancel} data-testid="institution-cancel-button" variant="text">
                  {t('cancel')}
                </Button>
              </StyledButtonContainer>
            </StyledInstitutionSearchContainer>
          )}
        </Field>
      </Form>
    </Formik>
  );
};

export default EditInstitution;
