import React, { useEffect, useState } from 'react';
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

interface AutoSearchProps {
  label: string;
  searchResults: any;
  setValueFunction: (value: any) => void;
  value: string;
  clearSearchField?: boolean;
  dataTestId?: string;
  onInputChange?: (event: object, value: string) => void;
}

export const AutoSearch: React.FC<AutoSearchProps> = ({
  clearSearchField,
  dataTestId,
  onInputChange,
  searchResults,
  setValueFunction,
  label,
  value,
}) => {
  const [displayValue, setDisplayValue] = useState({ title: '' });
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
    if (!value) {
      setDisplayValue({ title: '' });
    }
    setDisplayValue({ title: value });
  }, [value]);

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
        setOptions([]);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onChange={(_: object, value: string) => {
        setValueFunction(value);
      }}
      onInputChange={(event: object, value: string) => {
        value.length >= MINIMUM_SEARCH_CHARACTERS && options.length === 0 && open && setLoading(true);
        open && value.length >= MINIMUM_SEARCH_CHARACTERS && onInputChange && onInputChange(event, value);
      }}
      getOptionLabel={option => option.title || ''}
      options={options}
      loading={loading}
      value={displayValue}
      noOptionsText={t('no_hits')}
      renderInput={params => (
        <TextField
          {...params}
          data-testid={dataTestId}
          label={label}
          fullWidth
          variant="outlined"
          autoComplete="false"
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
