import React from 'react';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import { SeriesSearch } from './SeriesSearch';

export const SeriesFields = () => {
  const { t } = useTranslation('registration');

  return (
    <>
      <SeriesSearch />

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
