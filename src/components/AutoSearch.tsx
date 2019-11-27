import React, { useEffect, useState } from 'react';

import { CircularProgress, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { MINIMUM_SEARCH_CHARACTERS } from '../utils/constants';

interface AutoSearchProps {
  onInputChange?: (event: object, value: string) => void;
  searchResults: any;
  setFieldValue: (value: any) => void;
  label: string;
}

export const AutoSearch: React.FC<AutoSearchProps> = ({ onInputChange, searchResults, setFieldValue, label }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchResults) {
      setOptions(searchResults);
      setLoading(false);
    }
  }, [searchResults]);

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
        setFieldValue(value);
      }}
      onInputChange={(event: object, value: string) => {
        value.length >= MINIMUM_SEARCH_CHARACTERS && options.length === 0 && setLoading(true);
        open && onInputChange && onInputChange(event, value);
      }}
      getOptionLabel={option => option.title}
      options={options}
      loading={loading}
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
