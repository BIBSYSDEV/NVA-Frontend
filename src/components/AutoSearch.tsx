import React, { useEffect, useState } from 'react';

import { CircularProgress, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { MINIMUM_SEARCH_CHARACTERS } from '../utils/constants';

interface AutoSearchProps {
  clearSearchField?: boolean;
  onInputChange?: (event: object, value: string) => void;
  searchResults: any;
  setValueFunction: (value: any) => void;
  label: string;
  groupBy?: (options: any) => string;
}

export const AutoSearch: React.FC<AutoSearchProps> = ({
  clearSearchField,
  onInputChange,
  searchResults,
  setValueFunction,
  label,
  groupBy,
}) => {
  const [value, setValue] = useState({ title: '' });
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchResults) {
      setOptions(searchResults);
      setLoading(false);
    }
  }, [searchResults]);

  useEffect(() => {
    if (clearSearchField) {
      setOptions([]);
      setValue({ title: '' });
    }
  }, [clearSearchField]);

  return (
    <Autocomplete
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
        setValue({ title: value });
        value.length >= MINIMUM_SEARCH_CHARACTERS && options.length === 0 && setLoading(true);
        open && value.length >= MINIMUM_SEARCH_CHARACTERS && onInputChange && onInputChange(event, value);
      }}
      getOptionLabel={option => option.title}
      options={options}
      loading={loading}
      value={value}
      groupBy={groupBy}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          fullWidth
          variant="outlined"
          autoComplete="false"
          InputProps={{
            ...params.InputProps,
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
