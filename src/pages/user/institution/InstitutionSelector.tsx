import React, { FC } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
// import { FormikInstitutionUnit } from '../../../types/institution.types';
// import { FormikProps, useFormikContext } from 'formik';
// import { getDepartments } from '../../../api/institutionApi';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
// import { FormikInstitutionUnitFieldNames } from '../../../types/institution.types';
import { Field, FieldProps } from 'formik';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

interface InstitutionSelectorProps {
  unit: any;
  fieldNamePrefix?: string;
}

const InstitutionSelector: FC<InstitutionSelectorProps> = ({ unit, fieldNamePrefix = '' }) => {
  const { t } = useTranslation('common');

  return (
    <StyledInstitutionSelector>
      <Field name={`${fieldNamePrefix}.subunit`}>
        {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
          <>
            <Autocomplete
              options={unit}
              getOptionLabel={(option: any) => option.name}
              noOptionsText={t('common:no_hits')}
              onChange={(_: any, value: any) => {
                setFieldValue(name, value);
              }}
              renderInput={(params) => (
                <TextField
                  // inputProps={{ 'data-testid': 'autosearch-institution' }}
                  {...params}
                  label={t('institution.subunit')}
                  placeholder={t('institution.search_subunit')}
                  variant="outlined"
                />
              )}
            />
            {value?.subunits && <InstitutionSelector unit={value.subunits} fieldNamePrefix={name} />}
          </>
        )}
      </Field>
    </StyledInstitutionSelector>
  );
};

export default InstitutionSelector;
