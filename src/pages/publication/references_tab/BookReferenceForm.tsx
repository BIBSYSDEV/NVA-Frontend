import React from 'react';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import PublisherSearch from './PublisherSearch';
import { useTranslation } from 'react-i18next';
import { BookFieldNames, bookTypes } from '../../../types/references.types';
import { MenuItem } from '@material-ui/core';

const BookReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  return (
    <>
      <Field name={BookFieldNames.TYPE} component={Select} variant="outlined" fullWidth>
        {bookTypes.map(type => (
          <MenuItem value={type.value} key={type.value}>
            {t(type.label)}
          </MenuItem>
        ))}
      </Field>

      <Field name={BookFieldNames.PUBLISHER}>
        {({ form: { setFieldValue } }: any) => (
          <PublisherSearch setFieldValue={value => setFieldValue(BookFieldNames.PUBLISHER, value)} />
        )}
      </Field>
    </>
  );
};

export default BookReferenceForm;
