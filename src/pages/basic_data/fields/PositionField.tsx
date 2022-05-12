import { Autocomplete, TextField } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../api/apiPaths';
import { PositionResponse } from '../../../types/user.types';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../utils/translation-helpers';

interface PositionFieldProps {
  fieldName: string;
  disabled?: boolean;
}

export const PositionField = ({ fieldName, disabled }: PositionFieldProps) => {
  const { t } = useTranslation('basicData');
  const [positionResponse, isLoadingPositions] = useFetchResource<PositionResponse>(
    CristinApiPath.Position,
    t('feedback:error.get_positions')
  );
  const sortedPositions = positionResponse
    ? [...positionResponse.positions].sort((a, b) =>
        getLanguageString(a.name).toLowerCase() > getLanguageString(b.name).toLowerCase() ? 1 : -1
      )
    : [];

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
        <Autocomplete
          disabled={disabled}
          value={sortedPositions.find((option) => option.id === field.value) ?? null}
          options={sortedPositions.sort((a, b) =>
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
