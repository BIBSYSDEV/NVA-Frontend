import React from 'react';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../../utils/constants';
import { mapLevel, publicationContextToPublisher } from './resource-helpers';
import PublicationChannelSearch from './PublicationChannelSearch';
import { TextField } from '@material-ui/core';
import { dataTestId } from '../../../../utils/dataTestIds';

export const SeriesFields = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <Field name={ResourceFieldNames.SERIES_TITLE}>
        {({ field: { name, value }, form: { setFieldValue } }: FieldProps<string>) => (
          <PublicationChannelSearch
            dataTestId={dataTestId.registrationWizard.resourceType.seriesField}
            publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
            label={t('common:title')}
            placeholder={t('resource_type.search_for_series')}
            errorFieldName={name}
            setValue={(newValue) => {
              setFieldValue(name, newValue?.title ?? '');
              setFieldValue(ResourceFieldNames.PUBLICATION_CONTEXT_LEVEL, newValue ? mapLevel(newValue.level) : '');
            }}
            value={publicationContextToPublisher({ title: value })}
          />
        )}
      </Field>

      <Field name={ResourceFieldNames.SERIES_NUMBER}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.seriesNumber}
            variant="filled"
            label={t('common:number')}
          />
        )}
      </Field>
    </>
  );
};
