import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, CircularProgress, TextFieldProps } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { InstitutionUnitBase } from '../../types/institution.types';
import { autocompleteTranslationProps } from '../../themes/mainTheme';

interface InstitutionAutocompleteProps extends Pick<TextFieldProps, 'disabled' | 'error' | 'helperText' | 'label'> {
  institutions: InstitutionUnitBase[];
  onChange: (value: InstitutionUnitBase | null) => void;
  value: InstitutionUnitBase | null;
  isLoading?: boolean;
}

const InstitutionAutocomplete: FC<InstitutionAutocompleteProps> = ({
  disabled,
  error,
  helperText,
  institutions,
  label,
  onChange,
  value = null,
  isLoading = false,
}) => {
  const { t } = useTranslation('common');

  return (
    <Autocomplete
      {...autocompleteTranslationProps}
      disabled={disabled}
      options={institutions}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => option.id === value.id}
      value={value}
      filterOptions={(options, state) => {
        const inputValue = state.inputValue.toLowerCase();
        return options.filter(
          (option) =>
            option.name.toLowerCase().includes(inputValue) || option.acronym?.toLowerCase().includes(inputValue)
        );
      }}
      loading={isLoading}
      onChange={(_, value) => onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label ?? t('institution')}
          placeholder={label ? t('institution:search_department') : t('institution:search_institution')}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            'data-testid': 'autocomplete-institution',
            'aria-label': t('institution'),
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

export default InstitutionAutocomplete;
