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
  label?: string;
  searchResults: any;
  setValueFunction: (value: any) => void;
  clearSearchField?: boolean;
  dataTestId?: string;
  onInputChange: (event: object, value: string) => void;
  placeholder?: string;
}

export const AutoSearch: FC<AutoSearchProps> = ({
  label,
  searchResults,
  setValueFunction,
  clearSearchField,
  dataTestId,
  onInputChange,
  placeholder,
}) => {
  const [displayValue, setDisplayValue] = useState(emptyValue);
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
      disableOpenOnFocus
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onChange={(_: object, value: string) => {
        if (value) {
          setValueFunction(value);
          setDisplayValue(emptyValue);
          setOptions([]);
        }
      }}
      onInputChange={(event: any, value: string) => {
        setDisplayValue({ title: value });

        // Update input if event comes from typing, not option selection
        if (event?.target.localName === 'input') {
          onInputChange(event, value);
          if (value.length >= MINIMUM_SEARCH_CHARACTERS) {
            setLoading(true);
          }
        }
      }}
      getOptionLabel={option => option.title || ''}
      options={options}
      loading={loading}
      blurOnSelect
      value={displayValue}
      noOptionsText={t('no_hits')}
      filterOptions={options => options}
      renderInput={params => (
        <TextField
          {...params}
          data-testid={dataTestId}
          label={label}
          fullWidth
          onClick={() => setOpen(true)}
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
        />
      )}
    />
  );
};

export default AutoSearch;
