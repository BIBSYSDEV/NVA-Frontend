import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Registration } from '../../../../../types/registration.types';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../utils/dataTestIds';

export const PeerReviewedField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={ResourceFieldNames.PeerReviewed}>
      {({ field: { name, value } }: FieldProps<boolean | null>) => (
        <FormControl data-testid={dataTestId.registrationWizard.resourceType.peerReviewed} required>
          <FormLabel sx={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('resource_type.peer_review')}</FormLabel>
          <RadioGroup
            value={value === true ? 'true' : value === false ? 'false' : ''}
            onChange={(event) => setFieldValue(name, event.target.value === 'true')}>
            <FormControlLabel
              control={<Radio value="true" />}
              label={<Typography>{t('translations:common.yes')}</Typography>}
            />
            <FormControlLabel
              control={<Radio value="false" />}
              label={<Typography>{t('translations:common.no')}</Typography>}
            />
          </RadioGroup>
          <ErrorMessage name={name} render={(message) => <FormHelperText error>{message}</FormHelperText>} />
        </FormControl>
      )}
    </Field>
  );
};
