import { Autocomplete, TextField, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
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

const getPositionCode = (url: string) => url.split('#').pop() ?? '';

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
          filterOptions={(options, state) => {
            const inputValueLowerCase = state.inputValue.toLowerCase();
            return options.filter(
              (option) =>
                getLanguageString(option.name).toLowerCase().includes(inputValueLowerCase) ||
                getPositionCode(option.id).toLowerCase().includes(inputValueLowerCase)
            );
          }}
          disabled={disabled}
          value={sortedPositions.find((option) => option.id === field.value) ?? null}
          options={sortedPositions}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <div>
                <Typography>{getLanguageString(option.name)}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {getPositionCode(option.id)}
                </Typography>
              </div>
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
              helperText={touched && error}
            />
          )}
        />
      )}
    </Field>
  );
};
