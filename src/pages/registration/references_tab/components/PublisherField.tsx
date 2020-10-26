import React, { FC } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ReferenceFieldNames, contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../../utils/constants';
import { publicationContextToPublisher, formatPublicationContextWithPublisher } from './reference-helpers';
import { Registration } from '../../../../types/registration.types';
import PublicationChannelSearch from './PublicationChannelSearch';

const PublisherField: FC = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={contextTypeBaseFieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <PublicationChannelSearch
          publicationTable={PublicationTableNumber.PUBLISHERS}
          label={t('common:publisher')}
          placeholder={t('references.search_for_publisher')}
          errorFieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_PUBLISHER}
          setValue={(newValue) => {
            const contextValues = formatPublicationContextWithPublisher(value.type, newValue);
            setFieldValue(name, contextValues);
          }}
          value={publicationContextToPublisher(value)}
        />
      )}
    </Field>
  );
};

export default PublisherField;
