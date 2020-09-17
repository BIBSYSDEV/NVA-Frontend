import React, { FC, ChangeEvent } from 'react';
import { Field, FieldProps } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { isbnRegex } from '../../PublicationFormValidationSchema';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';

const IsbnListField: FC = () => {
  const { t } = useTranslation('publication');
  const dispatch = useDispatch();

  return (
    <Field name={ReferenceFieldNames.ISBN_LIST}>
      {({ field, form: { setFieldValue }, meta: { error, touched } }: FieldProps) => (
        <Autocomplete
          {...field}
          freeSolo
          multiple
          options={[]}
          value={field.value ?? ''}
          onChange={(_: ChangeEvent<{}>, value: string[], reason) => {
            if (reason === 'create-option') {
              const newIsbn = value.pop()?.trim().replaceAll('-', '');
              if (newIsbn?.match(isbnRegex)) {
                setFieldValue(field.name, [...value, newIsbn]);
              } else {
                dispatch(setNotification(t('feedback:warning.invalid_isbn'), NotificationVariant.Warning));
              }
            } else {
              setFieldValue(field.name, value);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              data-testid="isbn"
              label={t('references.isbn')}
              helperText={t('references.isbn_helper')}
              variant="outlined"
              fullWidth
              error={!!error && touched}
            />
          )}
        />
      )}
    </Field>
  );
};

export default IsbnListField;
