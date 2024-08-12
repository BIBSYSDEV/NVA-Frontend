import { Step, StepButton, StepLabel, Stepper } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinProject, ProjectTab } from '../../../types/project.types';
import { RegistrationTab } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getProjectTabErrors } from '../../../utils/formik-helpers/project-form-helpers';

interface ProjectFormStepperProps {
  setTabNumber: (newTab: ProjectTab) => void;
  tabNumber: ProjectTab;
}

export const ProjectFormStepper = ({ tabNumber, setTabNumber }: ProjectFormStepperProps) => {
  const { t } = useTranslation();
  const { errors, touched } = useFormikContext<CristinProject>();
  const [maxVisitedTab, setMaxVisitedTab] = useState(ProjectTab.Description);

  const tabErrors = getProjectTabErrors(errors, touched);
  const descriptionTabHasError = tabErrors[RegistrationTab.Description].length > 0;
  const detailTabHasError = false;
  const contributorTabHasError = false;
  const connectionTabHasError = false;

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
          <StepLabel
            error={descriptionTabHasError}
            data-testid={descriptionTabHasError ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.description')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTab.Details}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectDetailsStepButton}
          onClick={() => onClickStep(ProjectTab.Details)}>
          <StepLabel
            error={detailTabHasError}
            data-testid={detailTabHasError ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.details')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTab.Contributors}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectContributorsStepButton}
          onClick={() => onClickStep(ProjectTab.Contributors)}>
          <StepLabel
            error={contributorTabHasError}
            data-testid={contributorTabHasError ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.project_participants')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTab.Connections}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectConnectionsStepButton}
          onClick={() => onClickStep(ProjectTab.Connections)}>
          <StepLabel
            error={connectionTabHasError}
            data-testid={connectionTabHasError ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.connections')}
          </StepLabel>
        </StepButton>
      </Step>
    </Stepper>
  );
};
