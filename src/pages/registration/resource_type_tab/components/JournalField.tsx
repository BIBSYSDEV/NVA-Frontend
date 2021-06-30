import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames, contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../../utils/constants';
import { publicationContextToPublisher, formatPublicationContextWithTitle } from './resource-helpers';
import { Registration } from '../../../../types/registration.types';
import PublicationChannelSearch from './PublicationChannelSearch';

const JournalField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={contextTypeBaseFieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <PublicationChannelSearch
          dataTestId="journal-search-field"
          publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
          label={t('resource_type.journal')}
          required
          placeholder={t('resource_type.search_for_journal')}
          errorFieldName={ResourceFieldNames.PUBLICATION_CONTEXT_TITLE}
          setValue={(newValue) => {
            const contextValues = formatPublicationContextWithTitle(value.type, newValue);
            setFieldValue(name, contextValues);
          }}
          value={publicationContextToPublisher(value)}
        />
      )}
    </Field>
  );
};

export default JournalField;
