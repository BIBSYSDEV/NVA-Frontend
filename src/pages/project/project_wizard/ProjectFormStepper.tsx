import { Step, StepButton, StepLabel, Stepper } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { CristinProject, ProjectTabs } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getProjectTabErrors } from '../../../utils/formik-helpers/project-form-helpers';

interface ProjectFormStepperProps {
  setTabNumber: (newTab: ProjectTabs) => void;
  tabNumber: ProjectTabs;
  maxVisitedTab: ProjectTabs;
  setMaxVisitedTab: (val: ProjectTabs) => void;
}

export const ProjectFormStepper = ({
  tabNumber,
  setTabNumber,
  maxVisitedTab,
  setMaxVisitedTab,
}: ProjectFormStepperProps) => {
  const { t } = useTranslation();
  const { errors, touched } = useFormikContext<CristinProject>();

  const tabErrors = getProjectTabErrors(errors, touched);
  const descriptionTabHasError = tabErrors[ProjectTabs.Description].length > 0;
  const detailsTabHasError = tabErrors[ProjectTabs.Details].length > 0;
  const contributorTabHasError = tabErrors[ProjectTabs.Contributors].length > 0;
  const connectionTabHasError = false;

  const onClickStep = (stepNumber: ProjectTabs) => {
    setTabNumber(stepNumber);
    if (stepNumber > maxVisitedTab) {
      setMaxVisitedTab(stepNumber);
    }
  };

  return (
    <Stepper nonLinear activeStep={tabNumber}>
      <Step completed={maxVisitedTab >= ProjectTabs.Description}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectDescriptionStepButton}
          onClick={() => onClickStep(ProjectTabs.Description)}>
          <StepLabel
            error={descriptionTabHasError}
            data-testid={descriptionTabHasError ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.description')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTabs.Details}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectDetailsStepButton}
          onClick={() => onClickStep(ProjectTabs.Details)}>
          <StepLabel
            error={detailsTabHasError}
            data-testid={detailsTabHasError ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.details')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTabs.Contributors}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectContributorsStepButton}
          onClick={() => onClickStep(ProjectTabs.Contributors)}>
          <StepLabel
            error={contributorTabHasError && maxVisitedTab > ProjectTabs.Contributors}
            data-testid={contributorTabHasError ? dataTestId.projectWizard.stepper.projectErrorStep : undefined}>
            {t('project.heading.project_participants')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={maxVisitedTab >= ProjectTabs.Connections}>
        <StepButton
          data-testid={dataTestId.projectWizard.stepper.projectConnectionsStepButton}
          onClick={() => onClickStep(ProjectTabs.Connections)}>
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
