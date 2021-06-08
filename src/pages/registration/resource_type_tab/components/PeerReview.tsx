import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { Registration } from '../../../../types/registration.types';

interface PeerReviewProps {
  fieldName: string;
}

const PeerReview = ({ fieldName }: PeerReviewProps) => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={fieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <>
          <div>
            <Typography variant="h5" color="primary" component="p">
              {t('resource_type.peer_review')}
            </Typography>
          </div>
          <FormControl data-testid="peer-review-field">
            <RadioGroup
              value={value ? 'true' : 'false'}
              onChange={(event) => setFieldValue(name, event.target.value === 'true')}>
              <FormControlLabel
                control={<Radio color="primary" data-testid="peer_review-true" value="true" />}
                label={<Typography>{t('common:yes')}</Typography>}
              />
              <FormControlLabel
                control={<Radio color="primary" data-testid="peer_review-false" value="false" />}
                label={<Typography>{t('common:no')}</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </>
      )}
    </Field>
  );
};

export default PeerReview;
