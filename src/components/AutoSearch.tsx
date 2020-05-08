import React, { FC, useEffect, useState, ReactNode } from 'react';
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
  errorMessage?: ReactNode;
  initialValue?: string;
  label?: string;
  placeholder?: string;
}

export const AutoSearch: FC<AutoSearchProps> = ({
  onInputChange,
  searchResults,
  setValueFunction,
  clearSearchField,
  dataTestId,
  disabled,
  displaySelection,
  errorMessage,
  initialValue,
  label,
  placeholder,
}) => {
  const [displayValue, setDisplayValue] = useState<any>(initialValue ? { title: initialValue } : emptyValue);
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
      blurOnSelect
      disabled={disabled}
      filterOptions={(options) => options}
      getOptionLabel={(option: any) => option.title || option.name || ''}
      loading={loading}
      noOptionsText={t('no_hits')}
      onChange={(_: object, value: string | null) => {
        if (value) {
          setValueFunction(value);
          if (!displaySelection) {
            setDisplayValue(emptyValue);
          }
          setOptions([]);
        }
      }}
      onClose={() => {
        setOpen(false);
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
      onOpen={() => {
        setOpen(true);
      }}
      open={displayValue.title.length >= MINIMUM_SEARCH_CHARACTERS && open}
      openOnFocus={false}
      options={options}
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
      value={displayValue}
    />
  );
};

export default AutoSearch;
