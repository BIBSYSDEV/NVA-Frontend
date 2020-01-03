import { Field, FormikProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import { BookFieldNames, bookTypes } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import JournalPublisherRow from './components/JournalPublisherRow';
import PublicationChannelSearch from './PublicationChannelSearch';

const BookReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<any> = useFormikContext();

  return (
    <>
      <Field name={BookFieldNames.TYPE} variant="outlined" fullWidth>
        {({ field: { onChange, value } }: any) => (
          <FormControl variant="outlined">
            <InputLabel>{t('common:type')}</InputLabel>
            <Select value={value} onChange={onChange}>
              {bookTypes.map(type => (
                <MenuItem value={type.value} key={type.value}>
                  {t(type.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Field>

      <Field name={BookFieldNames.PUBLISHER}>
        {() => (
          <PublicationChannelSearch
            label={t('publication:references.publisher')}
            publicationTable={PublicationTableNumber.PUBLISHERS}
            setValueFunction={value => setFieldValue('reference.book.selectedPublisher', value)}
          />
        )}
      </Field>
      <Field name="reference.book.selectedPublisher">
        {({ field, form: { setFieldValue } }: any) => (
          <JournalPublisherRow
            hidePublisher
            label={t('references.publisher')}
            publisher={field.value}
            setValue={value => setFieldValue(field.name, value)}
          />
        )}
      </Field>
    </>
  );
};

export default BookReferenceForm;
