import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import disciplines from '../../../../resources/disciplines.json';
import { dataTestId } from '../../../../utils/dataTestIds';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

const disciplineOptions = disciplines
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
      }: FieldProps<string>) => {
        const selectedOption = disciplineOptions.find((discipline) => discipline.id === value);

        return (
          <Autocomplete
            data-testid={dataTestId.registrationWizard.resourceType.scientificSubjectField}
            id={name}
            multiple
            aria-labelledby={`${name}-label`}
            options={disciplineOptions}
            blurOnSelect
            groupBy={(discipline) => t(`disciplines:${discipline.mainDisciplineId}`)}
            onChange={(_, value) => setFieldValue(name, value.pop()?.id ?? '')}
            value={selectedOption ? [selectedOption] : []}
            getOptionLabel={(option) => t(`disciplines:${option.id}`)}
            renderInput={(params) => (
              <TextField
                {...params}
                onBlur={() => (!touched ? setFieldTouched(name) : null)}
                label={t('description.npi_disciplines')}
                required
                fullWidth
                variant="filled"
                placeholder={!value ? t('description.search_for_npi_discipline') : ''}
                error={!!error && touched}
                helperText={<ErrorMessage name={name} />}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      {params.InputProps.startAdornment}
                      {!value && <StyledSearchIcon />}
                    </>
                  ),
                }}
              />
            )}
          />
        );
      }}
    </Field>
  );
};
