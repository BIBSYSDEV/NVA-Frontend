import React, { FC, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, CircularProgress, TextFieldProps } from '@material-ui/core';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { InstitutionUnitBase } from '../../types/institution.types';

interface InstitutionAutocompleteProps extends Pick<TextFieldProps, 'disabled' | 'error' | 'helperText'> {
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
  onChange,
  value = null,
  isLoading = false,
}) => {
  const { t } = useTranslation('common');

  return (
    <Autocomplete
      disabled={disabled}
      options={institutions}
      getOptionLabel={(option: InstitutionUnitBase) => option.name}
      getOptionSelected={(option: InstitutionUnitBase, value: InstitutionUnitBase) => option.id === value.id}
      value={value}
      filterOptions={(options: InstitutionUnitBase[], state: FilterOptionsState<InstitutionUnitBase>) => {
        const inputValue = state.inputValue.toLowerCase();
        return options.filter(
          (option) =>
            option.name.toLowerCase().includes(inputValue) || option.acronym?.toLowerCase().includes(inputValue)
        );
      }}
      noOptionsText={t('no_hits')}
      onChange={(_: ChangeEvent<{}>, value: InstitutionUnitBase | null) => onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('institution')}
          placeholder={t('institution:search_institution')}
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
