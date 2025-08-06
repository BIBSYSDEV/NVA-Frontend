import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, IconButton, Step, StepButton, Stepper, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { navigationButtonStyling } from '../../pages/registration/RegistrationFormActions';
import { Registration } from '../../types/registration.types';
import { StyledPageContent } from '../styled/Wrappers';

interface MergeResultsWizardProps {
  sourceResult?: Registration; // Result to replace (left side)
  targetResult?: Registration; // Result to merge into (right side)
}

export const MergeResultsWizard = ({}: MergeResultsWizardProps) => {
  const { t } = useTranslation();
  const [tabNumber, setTabNumber] = useState(0);

  return (
    <StyledPageContent>
      <Stepper nonLinear activeStep={tabNumber} sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Step>
          <StepButton onClick={() => setTabNumber(0)}>{t('registration.heading.description')}</StepButton>
        </Step>
        <Step>
          <StepButton onClick={() => setTabNumber(1)}>{t('registration.heading.resource_type')}</StepButton>
        </Step>
        <Step>
          <StepButton onClick={() => setTabNumber(2)}>{t('registration.heading.contributors')}</StepButton>
        </Step>
        <Step>
          <StepButton onClick={() => setTabNumber(3)}>{t('registration.heading.files_and_license')}</StepButton>
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

      <Box sx={{ display: 'flex', gap: '1rem' }}>
        {tabNumber !== 0 && (
          <Tooltip title={t('common.previous')}>
            <IconButton onClick={() => setTabNumber(tabNumber - 1)}>
              <KeyboardArrowLeftIcon sx={navigationButtonStyling} />
            </IconButton>
          </Tooltip>
        )}

        {tabNumber !== 3 && (
          <Tooltip title={t('common.next')} sx={{ ml: 'auto' }}>
            <IconButton onClick={() => setTabNumber(tabNumber + 1)}>
              <KeyboardArrowRightIcon sx={navigationButtonStyling} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </StyledPageContent>
  );
};
