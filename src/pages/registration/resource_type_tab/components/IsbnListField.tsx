import { Field, FieldProps } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Chip, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ErrorMessage } from '../../../../utils/validation/errorMessage';
import { isbnRegex } from '../../../../utils/validation/registration/referenceValidation';

const IsbnListField = () => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();

  return (
    <Field name={ResourceFieldNames.ISBN_LIST}>
      {({ field, form: { setFieldValue, setFieldTouched }, meta: { error } }: FieldProps) => (
        <Autocomplete
          id={field.name}
          aria-labelledby={`${field.name}-label`}
          data-testid="isbn-field"
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
              label={t('resource_type.isbn')}
              helperText={t('resource_type.isbn_helper')}
              variant="filled"
              fullWidth
              error={!!error}
            />
          )}
        />
      )}
    </Field>
  );
};

export default IsbnListField;
