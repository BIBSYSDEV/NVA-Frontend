import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Formik, Field, FieldProps, Form } from 'formik';

import {
  FormikInstitutionUnit,
  emptyFormikUnit,
  FormikInstitutionUnitFieldNames,
  emptyRecursiveUnit,
} from '../types/institution.types';
import InstitutionSearch from '../pages/publication/references_tab/components/InstitutionSearch';
import InstitutionSelector from '../pages/user/institution/InstitutionSelector';

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

const StyledInstitutionSearchContainer = styled.div`
  width: 30rem;
`;

interface SelectInstitutionProps {
  onSubmit: (values: FormikInstitutionUnit) => void;
  onClose?: () => void;
}

const SelectInstitution: FC<SelectInstitutionProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation('profile');

  return (
    <Formik initialValues={emptyFormikUnit} onSubmit={onSubmit} validateOnChange={false}>
      <Form>
        <Field name={FormikInstitutionUnitFieldNames.UNIT}>
          {({ field: { name, value }, form: { values, setFieldValue, resetForm } }: FieldProps) => (
            <StyledInstitutionSearchContainer>
              <InstitutionSearch
                dataTestId="autosearch-institution"
                label={t('organization.institution')}
                clearSearchField={values.name === ''}
                setValueFunction={(inputValue) => {
                  setFieldValue(FormikInstitutionUnitFieldNames.NAME, inputValue.name);
                  setFieldValue(FormikInstitutionUnitFieldNames.ID, inputValue.id);
                  setFieldValue(name, inputValue ?? emptyRecursiveUnit);
                }}
                placeholder={t('organization.search_for_institution')}
              />
              {value.name && (
                <>
                  <InstitutionSelector unit={value} />
                  <StyledButton
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={!value}
                    data-testid="institution-add-button">
                    {t('common:add')}
                  </StyledButton>
                </>
              )}
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
