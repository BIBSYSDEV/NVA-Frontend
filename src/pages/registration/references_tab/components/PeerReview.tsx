import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { Registration } from '../../../../types/registration.types';

interface PeerReviewProps {
  fieldName: string;
  label: string;
}

const PeerReview: FC<PeerReviewProps> = ({ fieldName, label }) => {
  const { t } = useTranslation('registration');

  const { setFieldValue }: FormikProps<Registration> = useFormikContext();

  return (
    <Field name={fieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <>
          <Typography variant="h5">{label}</Typography>
          <FormControl>
            <RadioGroup
              value={value ? 'true' : 'false'}
              onChange={(event) => setFieldValue(name, event.target.value === 'true')}>
              <FormControlLabel
                control={<Radio color="primary" data-testid="peer_review-true" value="true" />}
                label={t('references.is_peer_reviewed')}
              />
              <FormControlLabel
                control={<Radio color="primary" data-testid="peer_review-false" value="false" />}
                label={t('references.is_not_peer_reviewed')}
              />
            </RadioGroup>
          </FormControl>
        </>
      )}
    </Field>
  );
};

export default PeerReview;
