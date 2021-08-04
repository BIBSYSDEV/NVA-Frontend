import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { StyledTypographyPreWrapped } from '../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../themes/lightTheme';
import { dataTestId } from '../../../../utils/dataTestIds';

interface NviValidationProps {
  isPeerReviewed: boolean;
  isRated: boolean;
  isOriginalResearch: boolean;
}

export const NviValidation = ({ isPeerReviewed, isRated, isOriginalResearch }: NviValidationProps) => {
  const { t } = useTranslation('registration');

  return (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.black}>
      {isRated ? (
        isPeerReviewed ? (
          isOriginalResearch ? (
            <StyledTypographyPreWrapped data-testid={dataTestId.registrationWizard.resourceType.nviSuccess}>
              {t('resource_type.nvi_success')}
            </StyledTypographyPreWrapped>
          ) : (
            <StyledTypographyPreWrapped
              data-testid={dataTestId.registrationWizard.resourceType.nviFailedOriginalResearch}>
              {t('resource_type.nvi_fail_not_original_research')}
            </StyledTypographyPreWrapped>
          )
        ) : (
          <StyledTypographyPreWrapped data-testid={dataTestId.registrationWizard.resourceType.nviFailedPeerReview}>
            {t('resource_type.nvi_fail_no_peer_review')}
          </StyledTypographyPreWrapped>
        )
      ) : (
        <StyledTypographyPreWrapped data-testid={dataTestId.registrationWizard.resourceType.nviFailedRated}>
          {t('resource_type.nvi_fail_not_rated')}
        </StyledTypographyPreWrapped>
      )}
    </BackgroundDiv>
  );
};
