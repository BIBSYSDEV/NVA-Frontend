import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Card from '../../../../components/Card';
import { StyledNormalTextPreWrapped } from '../../../../components/styled/Wrappers';

const StyledNviValidation = styled(Card)`
  margin-top: 1rem;
`;

interface NviValidationProps {
  dataTestId: string;
  isPeerReviewed: boolean;
  isRated: boolean;
  isTextbook?: boolean;
}

const NviValidation = ({ dataTestId, isPeerReviewed, isRated, isTextbook }: NviValidationProps) => {
  const { t } = useTranslation('registration');

  return (
    <StyledNviValidation data-testid={dataTestId}>
      {!isTextbook ? (
        isPeerReviewed ? (
          isRated ? (
            <StyledNormalTextPreWrapped data-testid="nvi_success">
              {t('references.nvi_success')}
            </StyledNormalTextPreWrapped>
          ) : (
            <StyledNormalTextPreWrapped data-testid="nvi_fail_not_rated">
              {t('references.nvi_fail_not_rated')}
            </StyledNormalTextPreWrapped>
          )
        ) : (
          <StyledNormalTextPreWrapped data-testid="nvi_fail_no_peer_review">
            {t('references.nvi_fail_no_peer_review')}
          </StyledNormalTextPreWrapped>
        )
      ) : (
        <StyledNormalTextPreWrapped data-testid="nvi_fail">{t('references.nvi_fail')}</StyledNormalTextPreWrapped>
      )}
    </StyledNviValidation>
  );
};

export default NviValidation;
