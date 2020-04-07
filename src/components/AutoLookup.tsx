import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

interface AutoLookupProps {
  label: string;
  options: any[];
  setValueFunction: (value: any) => void;
  dataTestId?: string;
  groupBy?: (options: any) => string;
  placeholder?: string;
  value?: string;
}

const AutoLookup: FC<AutoLookupProps> = ({
  label,
  options,
  setValueFunction,
  dataTestId,
  groupBy,
  placeholder,
  value,
}) => {
  const [displayValue, setDisplayValue] = useState<any>({ title: value });

  useEffect(() => {
    if (!value) {
      setDisplayValue({ title: '' });
    }
    setDisplayValue({ title: value });
  }, [value]);

  return (
    <Autocomplete
      options={options}
      groupBy={groupBy}
      getOptionLabel={(option: any) => option.title || ''}
      onChange={(_: object, value: string | null) => {
        setValueFunction(value);
      }}
      value={displayValue}
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid={dataTestId}
          label={label}
          fullWidth
          variant="outlined"
          autoComplete="false"
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: <StyledSearchIcon />,
            endAdornment: <>{params.InputProps.endAdornment}</>,
          }}
        />
      )}
    />
  );
};

export default AutoLookup;
