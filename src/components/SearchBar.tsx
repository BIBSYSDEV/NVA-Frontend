import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Field, FieldProps } from 'formik';

const StyledTextField = styled(TextField)`
  margin-top: 0;
`;

export const SearchBar = (props: unknown) => {
  const { t } = useTranslation('search');

  return (
    <Field name="searchTerm" {...props}>
      {({ field }: FieldProps<string>) => (
        <StyledTextField
          {...field}
          id={field.name}
          data-testid="search-field"
          autoFocus
          fullWidth
          variant="outlined"
          label={t('search')}
          helperText={t('search_help')}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" data-testid="search-button" title={t('search')}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      )}
    </Field>
  );
};
