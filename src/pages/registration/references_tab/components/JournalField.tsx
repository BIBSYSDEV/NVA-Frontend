import React, { FC } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ReferenceFieldNames, contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../../utils/constants';
import { publicationContextToPublisher, formatPublicationContextWithTitle } from './reference-helpers';
import { Registration } from '../../../../types/registration.types';
import PublicationChannelSearch from './PublicationChannelSearch';

interface JournalFieldProps {
  disabled?: boolean;
}

const JournalField: FC<JournalFieldProps> = ({ disabled }) => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={contextTypeBaseFieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <PublicationChannelSearch
          dataTestId="journal-search-input"
          publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
          label={t('references.journal')}
          required
          disabled={disabled}
          placeholder={t('references.search_for_journal')}
          errorFieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_TITLE}
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
