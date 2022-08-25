import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import disciplines from '../../../../resources/disciplines.json';
import { dataTestId } from '../../../../utils/dataTestIds';

const disciplineOptions = disciplines
  .map((mainDiscipline) =>
    mainDiscipline.subdomains.map((subDiscipline) => ({
      mainDisciplineId: mainDiscipline.id,
      id: subDiscipline.id,
    }))
  )
  .flat();

export const NpiDisciplineField = () => {
  const { t } = useTranslation();

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
            groupBy={(discipline) => t(`disciplines.${discipline.mainDisciplineId}` as any)}
            onChange={(_, value) => setFieldValue(name, value.pop()?.id ?? '')}
            value={selectedOption ? [selectedOption] : []}
            getOptionLabel={(option) => t(`disciplines.${option.id}` as any)}
            renderInput={(params) => (
              <TextField
                {...params}
                onBlur={() => (!touched ? setFieldTouched(name, true, false) : null)}
                label={t('registration.description.npi_disciplines')}
                required
                fullWidth
                variant="filled"
                placeholder={!value ? t('registration.description.search_for_npi_discipline') : ''}
                error={!!error && touched}
                helperText={<ErrorMessage name={name} />}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      {params.InputProps.startAdornment}
                      {!value && <SearchIcon color="disabled" sx={{ marginLeft: '0.5rem' }} />}
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
