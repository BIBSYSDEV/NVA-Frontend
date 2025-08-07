import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, IconButton, Step, StepButton, Stepper, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { navigationButtonStyling } from '../../pages/registration/RegistrationFormActions';
import { getTitleString } from '../../utils/registration-helpers';
import { PageHeader } from '../PageHeader';
import { RegistrationIconHeader } from '../RegistrationIconHeader';
import { StyledPageContent } from '../styled/Wrappers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizard = () => {
  const { t } = useTranslation();
  const { activeTab } = useContext(MergeResultsWizardContext);

  return (
    <StyledPageContent sx={{ mx: 'auto' }}>
      <MergeResultsWizardHeader />
      <MergeResultsWizardStepper />

      {activeTab === 0 ? (
        <p>{t('registration.heading.description')}</p>
      ) : activeTab === 1 ? (
        <p>{t('registration.heading.resource_type')}</p>
      ) : activeTab === 2 ? (
        <p>{t('registration.heading.contributors')}</p>
      ) : activeTab === 3 ? (
        <p>{t('registration.heading.files_and_license')}</p>
      ) : null}

      <MergeResultsWizardActions />
    </StyledPageContent>
  );
};

const MergeResultsWizardHeader = () => {
  const { targetResult } = useContext(MergeResultsWizardContext);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RegistrationIconHeader
        publicationInstanceType={targetResult.entityDescription?.reference?.publicationInstance?.type}
        publicationDate={targetResult.entityDescription?.publicationDate}
        showYearOnly
      />
      <PageHeader variant="h1">{getTitleString(targetResult.entityDescription?.mainTitle)}</PageHeader>
    </Box>
  );
};

const MergeResultsWizardStepper = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useContext(MergeResultsWizardContext);

  return (
    <Stepper nonLinear activeStep={activeTab} sx={{ display: { xs: 'none', md: 'flex' } }}>
      <Step>
        <StepButton onClick={() => setActiveTab(0)}>{t('registration.heading.description')}</StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setActiveTab(1)}>{t('registration.heading.resource_type')}</StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setActiveTab(2)}>{t('registration.heading.contributors')}</StepButton>
      </Step>
      <Step>
        <StepButton onClick={() => setActiveTab(3)}>{t('registration.heading.files_and_license')}</StepButton>
      </Step>
    </Stepper>
  );
};

const MergeResultsWizardActions = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useContext(MergeResultsWizardContext);

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      {activeTab !== 0 && (
        <Tooltip title={t('common.previous')}>
          <IconButton onClick={() => setActiveTab(activeTab - 1)}>
            <KeyboardArrowLeftIcon sx={navigationButtonStyling} />
          </IconButton>
        </Tooltip>
      )}

      {activeTab !== 3 && (
        <Tooltip title={t('common.next')} sx={{ ml: 'auto' }}>
          <IconButton onClick={() => setActiveTab(activeTab + 1)}>
            <KeyboardArrowRightIcon sx={navigationButtonStyling} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
