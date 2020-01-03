import { Field, FormikProps, useFormikContext } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { MenuItem } from '@material-ui/core';

import { BookFieldNames, bookTypes } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './PublicationChannelSearch';

const BookReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<any> = useFormikContext();

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
        {() => (
          <PublicationChannelSearch
            label={t('publication:references.publisher')}
            publicationTable={PublicationTableNumber.PUBLISHERS}
            setValueFunction={value => setFieldValue(BookFieldNames.PUBLISHER, value)}
          />
        )}
      </Field>
    </>
  );
};

export default BookReferenceForm;
