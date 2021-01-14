import { Field, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Registration } from '../../../../types/registration.types';

const StyledPeerReview = styled.div`
  margin-top: 1rem;
`;

interface PeerReviewProps {
  fieldName: string;
  label: string;
}

const PeerReview: FC<PeerReviewProps> = ({ fieldName, label }) => {
  const { t } = useTranslation('registration');
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={fieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <StyledPeerReview>
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
        </StyledPeerReview>
      )}
    </Field>
  );
};

export default PeerReview;
