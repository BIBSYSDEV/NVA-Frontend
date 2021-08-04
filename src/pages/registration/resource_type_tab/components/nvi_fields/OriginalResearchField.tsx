import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { Registration } from '../../../../../types/registration.types';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../utils/dataTestIds';

export const OriginalResearchField = () => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={ResourceFieldNames.OriginalResearch}>
      {({ field: { name, value } }: FieldProps<boolean | null>) => (
        <FormControl data-testid={dataTestId.registrationWizard.resourceType.originalResearchField} required>
          <FormLabel component="legend">{t('resource_type.presents_original_research_label')}</FormLabel>
          <RadioGroup
            value={value === true ? 'true' : value === false ? 'false' : ''}
            onChange={(event) => setFieldValue(name, event.target.value === 'true')}>
            <FormControlLabel
              control={<Radio color="primary" value="true" />}
              label={<Typography>{t('common:yes')}</Typography>}
            />
            <FormControlLabel
              control={<Radio color="primary" value="false" />}
              label={<Typography>{t('common:no')}</Typography>}
            />
          </RadioGroup>
          <ErrorMessage name={name} render={(message) => <FormHelperText error>{message}</FormHelperText>} />
        </FormControl>
      )}
    </Field>
  );
};
