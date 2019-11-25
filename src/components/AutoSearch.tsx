import React, { useEffect, useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface AutoSearchProps {
  onInputChange?: (event: object, value: string) => void;
  searchResults: any;
  setFieldValue: (name: string, value: any) => void;
  formikFieldName: string;
  label?: string;
}

export const AutoSearch: React.FC<AutoSearchProps> = ({
  onInputChange,
  formikFieldName,
  searchResults,
  setFieldValue,
  label,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && searchResults.length === 0;

  useEffect(() => {
    if (searchResults) {
      setOptions(searchResults);
    }
  }, [searchResults]);

  return (
    <Autocomplete
      style={{ width: 1000 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        setOptions([]);
      }}
      onChange={(_: object, value: string) => {
        setFieldValue(formikFieldName, value);
      }}
      onInputChange={(event: object, value: string) => {
        open && onInputChange && onInputChange(event, value);
      }}
      getOptionLabel={option => option.title}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label={label || formikFieldName}
          fullWidth
          variant="outlined"
          autoComplete="false"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
