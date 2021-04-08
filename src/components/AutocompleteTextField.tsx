import React, { FC } from 'react';
import styled from 'styled-components';
import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { AutocompleteRenderInputParams } from '@material-ui/lab';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

interface AutocompleteTextFieldProps
  extends AutocompleteRenderInputParams,
    Pick<TextFieldProps, 'placeholder' | 'label' | 'required'> {
  isLoading: boolean;
  showSearchIcon: boolean;
  errorMessage?: string;
}

export const AutocompleteTextField: FC<AutocompleteTextFieldProps> = ({
  isLoading,
  showSearchIcon,
  errorMessage,
  ...params
}) => (
  <TextField
    {...params}
    variant="filled"
    fullWidth
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
    error={!!errorMessage}
    helperText={errorMessage}
  />
);
