import { FC, ChangeEvent } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { InstitutionUnitBase } from '../../types/institution.types';
import { TextField, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';

interface InstitutionAutocompleteProps {
  institutions: InstitutionUnitBase[];
  onChange: (value: InstitutionUnitBase | null) => void;
  value: InstitutionUnitBase | null;
  isLoading?: boolean;
  disabled?: boolean;
}

const InstitutionAutocomplete: FC<InstitutionAutocompleteProps> = ({
  institutions,
  onChange,
  value,
  isLoading = false,
  disabled = false,
}) => {
  const { t } = useTranslation('common');
  return (
    <Autocomplete
      disabled={disabled}
      options={institutions}
      getOptionLabel={(option: InstitutionUnitBase) => option.name}
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
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default InstitutionAutocomplete;
