import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Card from '../../../../components/Card';

const StyledNviValidation = styled(Card)`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 4rem auto;
  grid-template-areas:
    'icon header'
    'icon information';
  padding: 1rem 0;
`;

const StyledNviHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  grid-area: header;
`;

const StyledNviInformation = styled.div`
  grid-area: information;
`;

const StyledCheckCircleIcon = styled(CheckCircleIcon)`
  grid-area: icon;
  color: green;
  margin: 1rem;
  font-size: 2rem;
`;

const StyledCancelIcon = styled(CancelIcon)`
  grid-area: icon;
  color: red;
  margin: 1rem;
  font-size: 2rem;
`;

interface NviValidationProps {
  dataTestId: string;
  isPeerReviewed: boolean;
  isRated: boolean;
}

const NviValidation: FC<NviValidationProps> = ({ dataTestId, isPeerReviewed, isRated }) => {
  const { t } = useTranslation('publication');

  return (
    <StyledNviValidation data-testid={dataTestId}>
      <StyledNviHeader>{t('references.nvi_header')}</StyledNviHeader>
      {isPeerReviewed ? (
        isRated ? (
          <>
            <StyledCheckCircleIcon />
            <StyledNviInformation>{t('references.nvi_success')}</StyledNviInformation>
          </>
        ) : (
          <>
            <StyledCancelIcon />
            <StyledNviInformation>
              <div>{t('references.nvi_fail_rated_line1')}</div>
              <div>{t('references.nvi_fail_rated_line2')}</div>
            </StyledNviInformation>
          </>
        )
      ) : (
        <>
          <StyledCancelIcon />
          <StyledNviInformation>
            <div>{t('references.nvi_fail_no_peer_review')}</div>
          </StyledNviInformation>
        </>
      )}
    </StyledNviValidation>
  );
};

export default NviValidation;
