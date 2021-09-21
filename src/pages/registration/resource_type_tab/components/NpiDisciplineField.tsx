import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { NpiDiscipline } from '../../../../types/registration.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import disciplines from '../../../../resources/disciplines.json';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

const disciplineOptions: NpiDiscipline[] = disciplines
  .map((mainDiscipline) =>
    mainDiscipline.subdomains.map((subDiscipline) => ({
      mainDisciplineId: mainDiscipline.id,
      id: subDiscipline.id,
    }))
  )
  .flat();

export const NpiDisciplineField = () => {
  const { t } = useTranslation('registration');

  return (
    <Field name={ResourceFieldNames.NpiSubjectHeading}>
      {({
        field: { name, value },
        form: { setFieldValue, setFieldTouched },
        meta: { error, touched },
      }: FieldProps<string>) => (
        <Autocomplete
          id={name}
          aria-labelledby={`${name}-label`}
          options={disciplineOptions}
          groupBy={(discipline) => t(`disciplines:${discipline.mainDisciplineId}`)}
          onChange={(_, value) => setFieldValue(name, value?.id ?? '')}
          value={disciplineOptions.find((discipline) => discipline.id === value) ?? null}
          getOptionLabel={(option) => t(`disciplines:${option.id}`)}
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
