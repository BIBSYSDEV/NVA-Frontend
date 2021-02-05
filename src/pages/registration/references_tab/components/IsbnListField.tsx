import { Field, FieldProps } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Chip, MuiThemeProvider, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import styled from 'styled-components';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { ErrorMessage } from '../../../../utils/validation/errorMessage';
import { isbnRegex } from '../../../../utils/validation/registration/referenceValidation';
import lightTheme from '../../../../themes/lightTheme';

const StyledHelperText = styled.span`
  color: ${({ theme }) => theme.palette.common.white};
`;

const IsbnListField = () => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();

  return (
    <Field name={ReferenceFieldNames.ISBN_LIST}>
      {({ field, form: { setFieldValue, setFieldTouched }, meta: { error } }: FieldProps) => (
        <MuiThemeProvider theme={lightTheme}>
          <Autocomplete
            freeSolo
            autoSelect
            multiple
            options={[]}
            value={field.value ?? ''}
            onChange={(_: ChangeEvent<unknown>, value: string[], reason) => {
              setFieldTouched(field.name);
              if (reason === 'create-option' || reason === 'blur') {
                const newIsbn = value.pop()?.trim().replace(/-/g, '');
                if (newIsbn?.match(isbnRegex)) {
                  setFieldValue(field.name, [...value, newIsbn]);
                } else {
                  dispatch(setNotification(ErrorMessage.INVALID_ISBN, NotificationVariant.Warning));
                }
              } else {
                setFieldValue(field.name, value);
              }
            }}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  data-testid="isbn-chip"
                  label={option}
                  {...getTagProps({ index })}
                  color={error && error[index] ? 'secondary' : 'default'}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="isbn-input"
                label={t('references.isbn')}
                helperText={<StyledHelperText>{t('references.isbn_helper')}</StyledHelperText>}
                variant="filled"
                fullWidth
                error={!!error}
              />
            )}
          />
        </MuiThemeProvider>
      )}
    </Field>
  );
};

export default IsbnListField;
