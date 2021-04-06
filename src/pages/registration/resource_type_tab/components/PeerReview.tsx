import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { Registration } from '../../../../types/registration.types';

interface PeerReviewProps {
  fieldName: string;
  label: string;
}

const PeerReview = ({ fieldName, label }: PeerReviewProps) => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={fieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <>
          <div>
            <Typography variant="h5" color="primary" variantMapping={{ h5: 'p' }}>
              {label}
            </Typography>
          </div>
          <FormControl>
            <RadioGroup
              value={value ? 'true' : 'false'}
              onChange={(event) => setFieldValue(name, event.target.value === 'true')}>
              <FormControlLabel
                control={<Radio color="primary" data-testid="peer_review-true" value="true" />}
                label={<Typography>{t('resource_type.is_peer_reviewed')}</Typography>}
              />
              <FormControlLabel
                control={<Radio color="primary" data-testid="peer_review-false" value="false" />}
                label={<Typography>{t('resource_type.is_not_peer_reviewed')}</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </>
      )}
    </Field>
  );
};

export default PeerReview;
