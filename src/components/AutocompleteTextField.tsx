import React from 'react';
import styled from 'styled-components';
import { CircularProgress, TextField, TextFieldProps, AutocompleteRenderInputParams } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

interface AutocompleteTextFieldProps
  extends AutocompleteRenderInputParams,
    Pick<TextFieldProps, 'placeholder' | 'label' | 'required'> {
  isLoading: boolean;
  showSearchIcon?: boolean;
  errorMessage?: string;
}

export const AutocompleteTextField = ({
  isLoading,
  showSearchIcon,
  errorMessage,
  ...params
}: AutocompleteTextFieldProps) => (
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
          {isLoading && <CircularProgress size={20} />}
          {params.InputProps.endAdornment}
        </>
      ),
    }}
    error={!!errorMessage}
    helperText={errorMessage}
  />
);
