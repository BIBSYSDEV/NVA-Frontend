import React, { FC, KeyboardEvent } from 'react';
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
}

export const AutocompleteTextField: FC<AutocompleteTextField> = ({ isLoading, ...params }) => (
  <TextField
    {...params}
    variant="outlined"
    fullWidth
    onKeyDown={(event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        // Disable removing chips with backspace
        event.stopPropagation();
      }
    }}
    inputProps={{
      ...params.inputProps,
      'data-testid': 'project-search-input',
    }}
    InputProps={{
      ...params.InputProps,
      startAdornment: (
        <>
          {params.InputProps.startAdornment}
          <StyledSearchIcon />
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
