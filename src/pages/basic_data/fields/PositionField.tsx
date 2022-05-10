import { Autocomplete, TextField } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../api/apiPaths';
import { PositionResponse } from '../../../types/user.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';

interface PositionFieldProps {
  fieldName: string;
  disabled?: boolean;
}

export const PositionField = ({ fieldName, disabled }: PositionFieldProps) => {
  const { t } = useTranslation('basicData');
  const [positionResponse, isLoadingPositions] = useFetch<PositionResponse>({ url: CristinApiPath.Position });
  const positions = positionResponse?.positions ?? [];

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
        <Autocomplete
          disabled={disabled}
          value={positions.find((option) => option.id === field.value) ?? null}
          options={positions.sort((a, b) =>
            getLanguageString(a.name).toLowerCase() > getLanguageString(b.name).toLowerCase() ? 1 : -1
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {getLanguageString(option.name)}
            </li>
          )}
          onChange={(_, value) => setFieldValue(field.name, value?.id ?? '')}
          getOptionLabel={(option) => getLanguageString(option.name)}
          fullWidth
          loading={isLoadingPositions}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              required
              label={t('position')}
              variant="filled"
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        />
      )}
    </Field>
  );
};
