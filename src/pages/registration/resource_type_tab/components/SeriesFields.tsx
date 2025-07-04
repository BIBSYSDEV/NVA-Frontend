import { TextField, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { RegistrationFormContext } from '../../../../context/RegistrationFormContext';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import { SeriesField } from './SeriesField';

export const SeriesFields = () => {
  const { t } = useTranslation();
  const { disableChannelClaimsFields } = useContext(RegistrationFormContext);

  return (
    <div>
      <Typography variant="h2">{t('registration.resource_type.series')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{t('registration.resource_type.series_info')}</Typography>

      <InputContainerBox>
        <SeriesField />

        <Field name={ResourceFieldNames.SeriesNumber}>
          {({ field }: FieldProps<string>) => (
            <TextField
              sx={{ alignSelf: 'flex-start' }}
              {...field}
              disabled={disableChannelClaimsFields}
              data-testid={dataTestId.registrationWizard.resourceType.seriesNumber}
              value={field.value ?? ''}
              variant="filled"
              label={t('registration.resource_type.series_number')}
            />
          )}
        </Field>
      </InputContainerBox>
    </div>
  );
};
