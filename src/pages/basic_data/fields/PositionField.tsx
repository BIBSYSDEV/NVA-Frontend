import { Autocomplete, TextField } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../api/apiPaths';
import { PositionResponse } from '../../../types/user.types';
import { useFetchResource } from '../../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../../utils/translation-helpers';

interface PositionFieldProps {
  fieldName: string;
  disabled?: boolean;
  includeDisabledPositions?: boolean;
}

export const PositionField = ({
  fieldName,
  disabled = false,
  includeDisabledPositions = false,
}: PositionFieldProps) => {
  const { t } = useTranslation();
  const [positionResponse, isLoadingPositions] = useFetchResource<PositionResponse>(
    includeDisabledPositions ? CristinApiPath.Position : `${CristinApiPath.Position}?active=true`,
    t('feedback.error.get_positions')
  );

  const sortedPositions = useMemo(
    () =>
      [...(positionResponse?.positions ?? [])].sort((a, b) =>
        getLanguageString(a.name).toLowerCase() > getLanguageString(b.name).toLowerCase() ? 1 : -1
      ),
    [positionResponse?.positions]
  );

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
        <Autocomplete
          disabled={disabled}
          value={sortedPositions.find((option) => option.id === field.value) ?? null}
          options={sortedPositions}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {getLanguageString(option.name)}
            </li>
          )}
          getOptionDisabled={(option) => !option.enabled}
          onChange={(_, value) => setFieldValue(field.name, value?.id ?? '')}
          getOptionLabel={(option) => getLanguageString(option.name)}
          fullWidth
          loading={isLoadingPositions}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              required
              label={t('basic_data.add_employee.position')}
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
