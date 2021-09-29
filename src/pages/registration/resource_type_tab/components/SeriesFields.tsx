import React from 'react';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import { SeriesField } from './SeriesField';

export const SeriesFields = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <SeriesField />

      <Field name={ResourceFieldNames.SeriesNumber}>
        {({ field }: FieldProps<string>) => (
          <TextField
            {...field}
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.seriesNumber}
            variant="filled"
            label={t('resource_type.series_number')}
          />
        )}
      </Field>
    </>
  );
};
