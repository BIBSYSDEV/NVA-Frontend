import React, { FC, ChangeEvent } from 'react';
import { Field, FieldProps } from 'formik';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const IsbnListField: FC = () => {
  const { t } = useTranslation('publication');

  return (
    <Field name={ReferenceFieldNames.ISBN_LIST}>
      {({ field, form: { setFieldValue } }: FieldProps) => (
        <Autocomplete
          {...field}
          freeSolo
          multiple
          options={[]}
          value={field.value ?? ''}
          onChange={(_: ChangeEvent<{}>, value: string[] | string) => setFieldValue(field.name, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              data-testid="isbn"
              label={t('references.isbn')}
              helperText={t('references.isbn_helper')}
              variant="outlined"
              fullWidth
            />
          )}
        />
      )}
    </Field>
  );
};

export default IsbnListField;
