import React, { FC } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../../utils/constants';
import { publicationContextToPublisher } from '../reference-helpers';
import { Registration } from '../../../../types/registration.types';
import PublicationChannelSearch from './PublicationChannelSearch';

const SeriesField: FC = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={ReferenceFieldNames.SERIES_TITLE}>
      {({ field: { name, value } }: FieldProps) => (
        <PublicationChannelSearch
          publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
          label={t('common:title')}
          placeholder={t('references.search_for_series')}
          errorFieldName={name}
          setValue={(newValue) => {
            setFieldValue(name, newValue?.title ?? '');
          }}
          value={publicationContextToPublisher({ title: value })}
        />
      )}
    </Field>
  );
};

export default SeriesField;
