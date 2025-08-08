import { Step, StepButton, Stepper } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardStepper = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useContext(MergeResultsWizardContext);

  return (
    <Stepper nonLinear activeStep={activeTab} sx={{ display: { xs: 'none', md: 'flex' } }}>
      <Step>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.descriptionStepButton}
          onClick={() => setActiveTab(0)}>
          {t('registration.heading.description')}
        </StepButton>
      </Step>
      <Step>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.resourceStepButton}
          onClick={() => setActiveTab(1)}>
          {t('registration.heading.resource_type')}
        </StepButton>
      </Step>
      <Step>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.contributorsStepButton}
          onClick={() => setActiveTab(2)}>
          {t('registration.heading.contributors')}
        </StepButton>
      </Step>
      <Step>
        <StepButton data-testid={dataTestId.registrationWizard.stepper.filesStepButton} onClick={() => setActiveTab(3)}>
          {t('registration.heading.files_and_license')}
        </StepButton>
      </Step>
    </Stepper>
  );
};
