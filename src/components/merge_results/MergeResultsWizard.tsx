import { Step, StepButton, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../types/registration.types';
import { BackgroundDiv } from '../styled/Wrappers';

interface MergeResultsWizardProps {
  sourceResult?: Registration; // Result to replace (left side)
  targetResult?: Registration; // Result to merge into (right side)
}

export const MergeResultsWizard = ({ sourceResult, targetResult }: MergeResultsWizardProps) => {
  const { t } = useTranslation();
  const [tabNumber, setTabNumber] = useState(0);

  return (
    <BackgroundDiv sx={{ bgcolor: 'secondary.main' }}>
      <Stepper nonLinear activeStep={tabNumber}>
        <Step>
          <StepButton onClick={() => setTabNumber(0)}>
            <StepLabel>{t('registration.heading.description')}</StepLabel>
          </StepButton>
        </Step>
        <Step>
          <StepButton onClick={() => setTabNumber(1)}>
            <StepLabel>{t('registration.heading.resource_type')}</StepLabel>
          </StepButton>
        </Step>
        <Step>
          <StepButton onClick={() => setTabNumber(2)}>
            <StepLabel>{t('registration.heading.contributors')}</StepLabel>
          </StepButton>
        </Step>
        <Step>
          <StepButton onClick={() => setTabNumber(3)}>
            <StepLabel>{t('registration.heading.files_and_license')}</StepLabel>
          </StepButton>
        </Step>
      </Stepper>

      {tabNumber === 0 ? (
        <p>{t('registration.heading.description')}</p>
      ) : tabNumber === 1 ? (
        <p>{t('registration.heading.resource_type')}</p>
      ) : tabNumber === 2 ? (
        <p>{t('registration.heading.contributors')}</p>
      ) : tabNumber === 3 ? (
        <p>{t('registration.heading.files_and_license')}</p>
      ) : null}
    </BackgroundDiv>
  );
};
