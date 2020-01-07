import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-weight: bold;
`;

interface PeerReviewProps {
  field: any;
  label: string;
  setFieldValue: any;
}

const PeerReview: FC<PeerReviewProps> = ({ field, label, setFieldValue }) => {
  const { t } = useTranslation('publication');

  return (
    <>
      <StyledLabel>{label}</StyledLabel>
      <FormControl>
        <RadioGroup
          value={field.value ? 'true' : 'false'}
          onChange={event => setFieldValue(field.name, event.target.value === 'true')}>
          <FormControlLabel control={<Radio value="true" />} label={t('references.is_peer_reviewed')} />
          <FormControlLabel control={<Radio value="false" />} label={t('references.is_not_peer_reviewed')} />
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default PeerReview;
