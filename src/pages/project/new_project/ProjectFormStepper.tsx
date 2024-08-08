import { Step, StepButton, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectTab } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface ProjectFormStepperProps {
  setTabNumber: (newTab: ProjectTab) => void;
  tabNumber: ProjectTab;
}

export const ProjectFormStepper = ({ tabNumber, setTabNumber }: ProjectFormStepperProps) => {
  const { t } = useTranslation();
  const error = false;
  const [maxVisitedTab, setMaxVisitedTab] = useState(ProjectTab.Description);

  const onClickStep = (stepNumber: ProjectTab) => {
    setTabNumber(stepNumber);
    if (stepNumber > maxVisitedTab) {
      setMaxVisitedTab(stepNumber);
    }
  };

  return (
    <Stepper nonLinear activeStep={tabNumber}>
      <Step completed={maxVisitedTab >= ProjectTab.Description}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectDescriptionStepButton}
          onClick={() => onClickStep(ProjectTab.Description)}>
          <StepLabel error={error} data-testid={error ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.description')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTab.Details}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectDetailsStepButton}
          onClick={() => onClickStep(ProjectTab.Details)}>
          <StepLabel error={error} data-testid={error ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.details')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTab.Contributors}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectContributorsStepButton}
          onClick={() => onClickStep(ProjectTab.Contributors)}>
          <StepLabel error={error} data-testid={error ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.project_participants')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTab.Connections}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectConnectionsStepButton}
          onClick={() => onClickStep(ProjectTab.Connections)}>
          <StepLabel error={error} data-testid={error ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.connections')}
          </StepLabel>
        </StepButton>
      </Step>
    </Stepper>
  );
};
