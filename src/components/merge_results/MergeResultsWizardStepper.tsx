import { Step, StepButton, Stepper } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardStepper = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useContext(MergeResultsWizardContext);

  return (
    <Stepper
      nonLinear
      activeStep={activeTab}
      sx={{ display: { xs: 'none', md: 'flex' }, maxWidth: '40rem', mx: 'auto' }}>
      <Step>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.descriptionStepButton}
          onClick={() => setActiveTab(RegistrationTab.Description)}>
          {t('registration.heading.description')}
        </StepButton>
      </Step>
      <Step>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.resourceStepButton}
          onClick={() => setActiveTab(RegistrationTab.ResourceType)}>
          {t('registration.heading.resource_type')}
        </StepButton>
      </Step>
      {/* <Step>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.contributorsStepButton}
          onClick={() => setActiveTab(RegistrationTab.Contributors)}>
          {t('registration.heading.contributors')}
        </StepButton>
      </Step>
      <Step>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.filesStepButton}
          onClick={() => setActiveTab(RegistrationTab.FilesAndLicenses)}>
          {t('registration.heading.files_and_license')}
        </StepButton>
      </Step> */}
    </Stepper>
  );
};
