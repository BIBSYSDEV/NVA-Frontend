import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CircularProgress, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MINIMUM_SEARCH_CHARACTERS } from '../utils/constants';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

const emptyValue = { title: '' };

interface AutoSearchProps {
  onInputChange: (value: string) => void;
  searchResults: any;
  setValueFunction: (value: any) => void;
  clearSearchField?: boolean;
  dataTestId?: string;
  disabled?: boolean;
  displaySelection?: boolean;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
}

export const AutoSearch: FC<AutoSearchProps> = ({
  onInputChange,
  searchResults,
  setValueFunction,
  clearSearchField,
  dataTestId,
  disabled,
  displaySelection,
  label,
  placeholder,
  errorMessage,
}) => {
  const [displayValue, setDisplayValue] = useState<any>(emptyValue);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('common');

  useEffect(() => {
    if (searchResults) {
      setOptions(searchResults);
      setLoading(false);
    }
  }, [searchResults]);

  useEffect(() => {
    if (clearSearchField) {
      setOptions([]);
    }
  }, [clearSearchField]);

  return (
    <Autocomplete
      openOnFocus={false}
      open={displayValue.title.length >= MINIMUM_SEARCH_CHARACTERS && open}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onChange={(_: object, value: string | null) => {
        if (value) {
          setValueFunction(value);
          if (!displaySelection) {
            setDisplayValue(emptyValue);
          }
          setOptions([]);
        }
      }}
      onInputChange={(_: any, value: string, reason: string) => {
        setDisplayValue({ title: value });

        if (reason === 'input') {
          if (value.length >= MINIMUM_SEARCH_CHARACTERS) {
            setLoading(true);
            onInputChange(value);
          } else {
            setOpen(false);
            setOptions([]);
          }
        } else {
          setOptions([]);
        }
      }}
      getOptionLabel={(option: any) => option.title || option.name || ''}
      options={options}
      loading={loading}
      blurOnSelect
      value={displayValue}
      noOptionsText={t('no_hits')}
      filterOptions={(options) => options}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid={dataTestId}
          label={label}
          fullWidth
          onClick={() => !disabled && displayValue.title && setOpen(true)}
          variant="outlined"
          autoComplete="false"
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: <StyledSearchIcon />,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      )}
    />
  );
};

export default AutoSearch;
