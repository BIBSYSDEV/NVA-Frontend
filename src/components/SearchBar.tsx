import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { Field, FieldProps } from 'formik';
import { dataTestId } from '../utils/dataTestIds';

const StyledTextField = styled(TextField)`
  margin-top: 0;
`;

export const SearchBar = () => {
  const { t } = useTranslation('search');

  return (
    <Field name="searchTerm">
      {({ field, form: { submitForm } }: FieldProps<string>) => (
        <StyledTextField
          {...field}
          id={field.name}
          data-testid={dataTestId.startPage.searchField}
          fullWidth
          variant="outlined"
          label={t('search')}
          helperText={t('search_help')}
          InputProps={{
            endAdornment: (
              <>
                {field.value && (
                  <IconButton
                    onClick={() => {
                      field.onChange({ target: { value: '', id: field.name } });
                      submitForm();
                    }}
                    title={t('common:clear')}>
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton type="submit" data-testid={dataTestId.startPage.searchButton} title={t('search')}>
                  <SearchIcon />
                </IconButton>
              </>
            ),
          }}
        />
      )}
    </Field>
  );
};
