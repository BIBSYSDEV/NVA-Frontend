import React, { FC } from 'react';
import { TextField, CircularProgress, TextFieldProps } from '@material-ui/core';
import { AutocompleteRenderInputParams } from '@material-ui/lab';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

interface AutocompleteTextField extends AutocompleteRenderInputParams, Pick<TextFieldProps, 'placeholder'> {
  isLoading: boolean;
  showSearchIcon: boolean;
  dataTestId?: string;
}

export const AutocompleteTextField: FC<AutocompleteTextField> = ({
  isLoading,
  dataTestId,
  showSearchIcon,
  ...params
}) => (
  <TextField
    {...params}
    variant="outlined"
    fullWidth
    inputProps={{
      ...params.inputProps,
      'data-testid': dataTestId,
    }}
    InputProps={{
      ...params.InputProps,
      startAdornment: (
        <>
          {params.InputProps.startAdornment}
          {showSearchIcon && <StyledSearchIcon />}
        </>
      ),
      endAdornment: (
        <>
          {isLoading && <CircularProgress color="inherit" size={20} />}
          {params.InputProps.endAdornment}
        </>
      ),
    }}
  />
);
