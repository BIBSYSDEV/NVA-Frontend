import { Field, FieldProps, Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import InstitutionSelector from '../../pages/user/institution/InstitutionSelector';
import {
  FormikInstitutionUnit,
  FormikInstitutionUnitFieldNames,
  InstitutionUnitBase,
} from '../../types/institution.types';
import useFetchDepartments from '../../utils/hooks/useFetchDepartments';
import useFetchInstitutions from '../../utils/hooks/useFetchInstitutions';
import { convertToInstitution } from '../../utils/institutions-helpers';
import InstitutionAutocomplete from './InstitutionAutocomplete';

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  margin: 0.5rem 0.5rem 0 0;
`;

interface EditInstitutionProps {
  initialInstitutionId: string;
  onSubmit: (values: FormikInstitutionUnit) => void;
  onCancel: () => void;
}

const EditInstitution: FC<EditInstitutionProps> = ({ initialInstitutionId, onCancel, onSubmit }) => {
  const { t } = useTranslation('common');
  const [institutions] = useFetchInstitutions();
  const [subunits, isLoadingSubunits] = useFetchDepartments(convertToInstitution(initialInstitutionId));
  const initialInstitution = institutions.filter(
    (institution: InstitutionUnitBase) => institution.id === convertToInstitution(initialInstitutionId)
  );
  const initialValue = initialInstitution.pop();

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      <Form>
        <Field name={FormikInstitutionUnitFieldNames.UNIT}>
          {({ field: { name }, form: { isSubmitting } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <InstitutionAutocomplete institutions={initialInstitution} disabled value={initialValue ?? null} />
              <InstitutionSelector units={subunits} fieldNamePrefix={name} label={t('institution:department')} />

              <StyledButton
                variant="contained"
                type="submit"
                color="primary"
                disabled={isLoadingSubunits || isSubmitting}
                data-testid="institution-add-button">
                {t('edit')}
              </StyledButton>

              <StyledButton onClick={onCancel} data-testid="institution-cancel-button" variant="contained">
                {t('cancel')}
              </StyledButton>
            </StyledInstitutionSearchContainer>
          )}
        </Field>
      </Form>
    </Formik>
  );
};

export default EditInstitution;
