import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Card from '../../../../components/Card';
import SubHeading from '../../../../components/SubHeading';
import { NormalTextPreWrapped } from '../../../../components/styled/Wrappers1';

const StyledNviValidation = styled(Card)`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 4rem auto;
  grid-template-areas:
    'icon header'
    'icon information';
  gap: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'header icon' 'information information';
    grid-template-columns: 4fr 1fr;
  }
`;

const StyledNviInformation = styled(NormalTextPreWrapped)`
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
      <SubHeading>{t('references.nvi_header')}</SubHeading>
      {isPeerReviewed ? (
        isRated ? (
          <>
            <StyledCheckCircleIcon />
            <StyledNviInformation>{t('references.nvi_success')}</StyledNviInformation>
          </>
        ) : (
          <>
            <StyledCancelIcon />
            <StyledNviInformation>{t('references.nvi_fail_not_rated')}</StyledNviInformation>
          </>
        )
      ) : (
        <>
          <StyledCancelIcon />
          <StyledNviInformation>{t('references.nvi_fail_no_peer_review')}</StyledNviInformation>
        </>
      )}
    </StyledNviValidation>
  );
};

export default NviValidation;
