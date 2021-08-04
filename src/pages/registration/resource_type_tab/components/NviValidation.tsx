import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { StyledTypographyPreWrapped } from '../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../themes/lightTheme';

interface NviValidationProps {
  dataTestId: string;
  isPeerReviewed: boolean;
  isRated: boolean;
  isOriginalResearch: boolean;
}

export const NviValidation = ({ dataTestId, isPeerReviewed, isRated, isOriginalResearch }: NviValidationProps) => {
  const { t } = useTranslation('registration');

  return (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.black} data-testid={dataTestId}>
      {isRated ? (
        isPeerReviewed ? (
          isOriginalResearch ? (
            <StyledTypographyPreWrapped data-testid="nvi_success">
              {t('resource_type.nvi_success')}
            </StyledTypographyPreWrapped>
          ) : (
            <StyledTypographyPreWrapped data-testid="nvi_fail">
              {t('resource_type.nvi_fail_not_original_research')}
            </StyledTypographyPreWrapped>
          )
        ) : (
          <StyledTypographyPreWrapped data-testid="nvi_fail_no_peer_review">
            {t('resource_type.nvi_fail_no_peer_review')}
          </StyledTypographyPreWrapped>
        )
      ) : (
        <StyledTypographyPreWrapped data-testid="nvi_fail_not_rated">
          {t('resource_type.nvi_fail_not_rated')}
        </StyledTypographyPreWrapped>
      )}
    </BackgroundDiv>
  );
};
