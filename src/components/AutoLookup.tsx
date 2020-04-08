import React, { FC } from 'react';
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
  value?: any;
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
  return (
    <Autocomplete
      options={options}
      groupBy={groupBy}
      onChange={(_: object, value: any) => setValueFunction(value)}
      value={value}
      getOptionLabel={(option: any) => option.title || option.name || ''}
      getOptionSelected={(option: any, value) => value.id === option.id}
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
