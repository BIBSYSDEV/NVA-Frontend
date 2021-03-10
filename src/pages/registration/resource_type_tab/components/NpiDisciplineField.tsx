import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { NpiDiscipline } from '../../../../types/registration.types';
import { disciplineOptions, getNpiDiscipline } from '../../../../utils/npiDisciplines';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

export const NpiDisciplineField = () => {
  const { t } = useTranslation('registration');

  return (
    <Field name={ResourceFieldNames.NPI_SUBJECT_HEADING}>
      {({
        field: { name, value },
        form: { setFieldValue, setFieldTouched },
        meta: { error, touched },
      }: FieldProps<string>) => (
        <Autocomplete
          options={disciplineOptions}
          groupBy={(discipline) => discipline.mainDiscipline}
          onChange={(_: unknown, value: NpiDiscipline | null) => setFieldValue(name, value?.id ?? '')}
          value={getNpiDiscipline(value)}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              onBlur={() => setFieldTouched(name)}
              data-testid="search_npi"
              label={t('description.npi_disciplines')}
              required
              fullWidth
              variant="filled"
              autoComplete="false"
              placeholder={t('description.search_for_npi_discipline')}
              error={!!error && touched}
              helperText={<ErrorMessage name={name} />}
              InputProps={{
                ...params.InputProps,
                startAdornment: <StyledSearchIcon />,
                endAdornment: <>{params.InputProps.endAdornment}</>,
              }}
            />
          )}
        />
      )}
    </Field>
  );
};
