import React, { FC, ChangeEvent } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps } from 'formik';
import { RecursiveInstitutionUnit } from '../../../types/institution.types';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

interface InstitutionSelectorProps {
  units: RecursiveInstitutionUnit[];
  fieldNamePrefix?: string;
}

const InstitutionSelector: FC<InstitutionSelectorProps> = ({ units, fieldNamePrefix = '' }) => {
  const { t } = useTranslation('institution');

  return (
    <StyledInstitutionSelector>
      <Field name={`${fieldNamePrefix}.subunit`}>
        {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
          <>
            <Autocomplete
              options={units}
              getOptionLabel={(option: RecursiveInstitutionUnit) => option.name}
              noOptionsText={t('common:no_hits')}
              onChange={(_: ChangeEvent<{}>, value: RecursiveInstitutionUnit | null) => {
                setFieldValue(name, value);
              }}
              renderInput={(params) => (
                <TextField
                  // inputProps={{ 'data-testid': 'autosearch-institution' }}
                  {...params}
                  label={t('subunit')}
                  placeholder={t('search_subunit')}
                  variant="outlined"
                />
              )}
            />
            {value?.subunits && <InstitutionSelector units={value.subunits} fieldNamePrefix={name} />}
          </>
        )}
      </Field>
    </StyledInstitutionSelector>
  );
};

export default InstitutionSelector;
