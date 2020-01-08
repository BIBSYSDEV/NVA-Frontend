import { Field, FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

import { PublicationFormsData } from '../../../../types/form.types';

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-weight: bold;
`;

interface PeerReviewProps {
  fieldName: string;
  label: string;
}

const PeerReview: FC<PeerReviewProps> = ({ fieldName, label }) => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<PublicationFormsData> = useFormikContext();

  return (
    <Field name={fieldName}>
      {({ field: { name, value } }: any) => (
        <>
          <StyledLabel>{label}</StyledLabel>
          <FormControl>
            <RadioGroup
              value={value ? 'true' : 'false'}
              onChange={event => setFieldValue(name, event.target.value === 'true')}>
              <FormControlLabel control={<Radio value="true" />} label={t('references.is_peer_reviewed')} />
              <FormControlLabel control={<Radio value="false" />} label={t('references.is_not_peer_reviewed')} />
            </RadioGroup>
          </FormControl>
        </>
      )}
    </Field>
  );
};

export default PeerReview;
