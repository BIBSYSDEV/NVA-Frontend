import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames, contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../../utils/constants';
import { publicationContextToPublisher, formatPublicationContextWithPublisher } from './resource-helpers';
import { Registration } from '../../../../types/registration.types';
import { PublicationChannelSearch } from './PublicationChannelSearch';

export const PublisherField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={contextTypeBaseFieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <PublicationChannelSearch
          dataTestId="publisher-search-field"
          publicationTable={PublicationTableNumber.PUBLISHERS}
          label={t('common:publisher')}
          required
          placeholder={t('resource_type.search_for_publisher')}
          errorFieldName={ResourceFieldNames.PUBLICATION_CONTEXT_PUBLISHER}
          setValue={(newValue) => {
            const contextValues: any = formatPublicationContextWithPublisher(value.type, newValue);
            if (newValue && value.seriesTitle) {
              // Keep data from selected series, since this has precedence
              contextValues.seriesTitle = value.seriesTitle;
              contextValues.level = value.level;
            }
            setFieldValue(name, contextValues);
          }}
          value={publicationContextToPublisher(value)}
        />
      )}
    </Field>
  );
};
