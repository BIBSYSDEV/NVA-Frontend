import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@mui/material';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import { SeriesField } from './SeriesField';
import { InputContainerBox } from '../../../../components/styled/Wrappers';

export const SeriesFields = () => {
  const { t } = useTranslation('registration');

  return (
    <div>
      <Typography variant="h5">{t('resource_type.series')}</Typography>
      <Typography paragraph>{t('resource_type.series_info')}</Typography>

      <InputContainerBox>
        <SeriesField />

        <Field name={ResourceFieldNames.SeriesNumber}>
          {({ field }: FieldProps<string>) => (
            <TextField
              sx={{ alignSelf: 'flex-start' }}
              {...field}
              id={field.name}
              data-testid={dataTestId.registrationWizard.resourceType.seriesNumber}
              value={field.value ?? ''}
              variant="filled"
              label={t('resource_type.series_number')}
            />
          )}
        </Field>
      </InputContainerBox>
    </div>
  );
};
