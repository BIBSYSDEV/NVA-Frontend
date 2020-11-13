import React, { FC } from 'react';
import { TextField, CircularProgress, TextFieldProps } from '@material-ui/core';
import { AutocompleteRenderInputParams } from '@material-ui/lab';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

interface AutocompleteTextFieldProps
  extends AutocompleteRenderInputParams,
    Pick<TextFieldProps, 'placeholder' | 'label'> {
  isLoading: boolean;
  showSearchIcon: boolean;
  dataTestId?: string;
  errorMessage?: string;
}

export const AutocompleteTextField: FC<AutocompleteTextFieldProps> = ({
  isLoading,
  dataTestId,
  showSearchIcon,
  errorMessage,
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
    error={!!errorMessage}
    helperText={errorMessage}
  />
);
