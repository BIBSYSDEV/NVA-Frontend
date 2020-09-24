import React, { FC, ChangeEvent } from 'react';
import { Field, FieldProps } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Chip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { isbnRegex } from '../../../../utils/validation/publication/referenceValidation';
import { ErrorMessage } from '../../../../utils/validation/errorMessage';

const IsbnListField: FC = () => {
  const { t } = useTranslation('publication');
  const dispatch = useDispatch();

  return (
    <Field name={ReferenceFieldNames.ISBN_LIST}>
      {({ field, form: { setFieldValue, setFieldTouched }, meta: { error } }: FieldProps) => (
        <Autocomplete
          freeSolo
          autoSelect
          multiple
          options={[]}
          value={field.value ?? ''}
          onChange={(_: ChangeEvent<{}>, value: string[], reason) => {
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
              helperText={t('references.isbn_helper')}
              variant="outlined"
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
