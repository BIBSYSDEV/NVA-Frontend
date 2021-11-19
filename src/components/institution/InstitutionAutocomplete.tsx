import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, TextField, TextFieldProps } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { InstitutionUnitBase } from '../../types/institution.types';
import { sortInstitutionsAlphabetically } from '../../utils/institutions-helpers';

interface InstitutionAutocompleteProps
  extends Pick<TextFieldProps, 'disabled' | 'error' | 'helperText' | 'label' | 'required'> {
  institutions: InstitutionUnitBase[];
  value: InstitutionUnitBase | null;
  isLoading?: boolean;
  onChange?: (value: InstitutionUnitBase | null) => void;
  id: string;
}

export const InstitutionAutocomplete = ({
  disabled,
  error,
  helperText,
  institutions,
  label,
  required,
  value = null,
  isLoading = false,
  id,
  onChange,
}: InstitutionAutocompleteProps) => {
  const { t } = useTranslation('common');

  return (
    <Autocomplete
      id={id}
      aria-labelledby={`${id}-label`}
      disabled={disabled}
      options={sortInstitutionsAlphabetically(institutions)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={value}
      filterOptions={(options, state) => {
        const inputValue = state.inputValue.toLowerCase();
        return options.filter(
          (option) =>
            option.name.toLowerCase().includes(inputValue) || option.acronym?.toLowerCase().includes(inputValue)
        );
      }}
      loading={isLoading}
      onChange={(_, value) => onChange?.(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label ?? t('institution')}
          required={required}
          placeholder={label ? t('institution:search_department') : t('institution:search_institution')}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            'data-testid': 'autocomplete-institution',
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && institutions.length === 0 && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};
