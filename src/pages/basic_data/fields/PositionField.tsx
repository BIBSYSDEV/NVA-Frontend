import { Autocomplete, TextField, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { setNotification } from '../../../redux/notificationSlice';
import { useDispatch } from 'react-redux';
import { fetchPositions } from '../../../api/cristinApi';

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
  const dispatch = useDispatch();

  const positionsQuery = useQuery({
    queryKey: ['positions', includeDisabledPositions],
    queryFn: () => fetchPositions(includeDisabledPositions),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_positions'), variant: 'error' })),
    staleTime: Infinity,
    cacheTime: 900_000, // 15 minutes
  });

  const sortedPositions = useMemo(
    () =>
      [...(positionsQuery.data?.positions ?? [])].sort((a, b) =>
        getLanguageString(a.name).toLowerCase() > getLanguageString(b.name).toLowerCase() ? 1 : -1
      ),
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
          loading={positionsQuery.isLoading}
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
