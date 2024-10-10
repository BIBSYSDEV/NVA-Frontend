import { Autocomplete, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchPositions } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
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

  const positionsQuery = useQuery({
    queryKey: ['positions', includeDisabledPositions],
    queryFn: () => fetchPositions(includeDisabledPositions),
    meta: { errorMessage: t('feedback.error.get_positions') },
    staleTime: Infinity,
    gcTime: 900_000, // 15 minutes
  });

  const sortedPositions = useMemo(
    () =>
      [...(positionsQuery.data?.positions ?? [])].sort((a, b) => {
        if (a.enabled === b.enabled) {
          return getLanguageString(a.labels).toLowerCase() > getLanguageString(b.labels).toLowerCase() ? 1 : -1;
        } else {
          return +b.enabled - +a.enabled;
        }
      }),
    [positionsQuery.data?.positions]
  );

  return (
    <Field name={fieldName}>
      {({ field, form: { setFieldValue }, meta: { error, touched } }: FieldProps<string>) => (
        <Autocomplete
          filterOptions={(options, state) => {
            const inputValueLowerCase = state.inputValue.toLowerCase();
            return options.filter(
              (option) =>
                getLanguageString(option.labels).toLowerCase().includes(inputValueLowerCase) ||
                getPositionCode(option.id).toLowerCase().includes(inputValueLowerCase)
            );
          }}
          disabled={disabled}
          value={sortedPositions.find((option) => option.id === field.value) ?? null}
          options={sortedPositions}
          renderOption={({ key, ...props }, option) => (
            <li {...props} key={option.id}>
              <div>
                <Typography>{getLanguageString(option.labels)}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {getPositionCode(option.id)}
                </Typography>
              </div>
            </li>
          )}
          getOptionDisabled={(option) => !option.enabled}
          onChange={(_, value) => setFieldValue(field.name, value?.id ?? '')}
          getOptionLabel={(option) => getLanguageString(option.labels)}
          fullWidth
          loading={positionsQuery.isPending}
          renderInput={(params) => (
            <TextField
              type="search"
              {...field}
              {...params}
              required
              label={t('basic_data.add_employee.position')}
              variant="filled"
              error={touched && !!error}
              helperText={touched && error}
              data-testid={dataTestId.basicData.personAdmin.position}
            />
          )}
        />
      )}
    </Field>
  );
};
