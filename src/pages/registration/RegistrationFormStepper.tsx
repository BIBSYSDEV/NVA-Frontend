import { Step, StepButton, StepLabel, Stepper, Theme, useMediaQuery } from '@mui/material';
import deepmerge from 'deepmerge';
import { useFormikContext } from 'formik';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationFormContext } from '../../context/RegistrationFormContext';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getTabErrors, getTouchedTabFields } from '../../utils/formik-helpers/formik-helpers';

interface RegistrationFormStepperProps {
  setTabNumber: (newTab: RegistrationTab) => void;
  tabNumber: RegistrationTab;
}

export const RegistrationFormStepper = ({ setTabNumber, tabNumber }: RegistrationFormStepperProps) => {
  const { t } = useTranslation();
  const { errors, touched, values, setTouched } = useFormikContext<Registration>();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const { highestVisitedTab, setHighestVisitedTab } = useContext(RegistrationFormContext);

  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  useEffect(() => {
    if (tabNumber > highestVisitedTab) {
      setHighestVisitedTab(tabNumber - 1); // Validate up to current tab
    }

    // Validate previous tab(s)
    const touchedFieldsOnUnmount = getTouchedTabFields(highestVisitedTab, valuesRef.current);
    const newTouchedFields = deepmerge.all([touchedRef.current, touchedFieldsOnUnmount], {
      arrayMerge: (_, sourceArray) => sourceArray, // associatedArtifacts must keep sourceArray in cases where it contains both files and link
    });
    setTouched(newTouchedFields);

    return () => {
      if (tabNumber > highestVisitedTab) {
        setHighestVisitedTab(tabNumber); // Validate current tab
      }
    };
  }, [setTouched, setHighestVisitedTab, tabNumber, highestVisitedTab]);

  const tabErrors = getTabErrors(valuesRef.current, errors, touched);
  const descriptionTabHasError = tabErrors[RegistrationTab.Description].length > 0;
  const resourceTabHasError = tabErrors[RegistrationTab.ResourceType].length > 0;
  const contributorTabHasError = tabErrors[RegistrationTab.Contributors].length > 0;
  const fileTabHasError = tabErrors[RegistrationTab.FilesAndLicenses].length > 0;

  return isMobile ? null : (
    <Stepper nonLinear activeStep={tabNumber}>
      <Step completed={highestVisitedTab >= RegistrationTab.Description && !descriptionTabHasError}>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.descriptionStepButton}
          onClick={() => setTabNumber(RegistrationTab.Description)}>
          <StepLabel
            error={descriptionTabHasError}
            data-testid={descriptionTabHasError ? dataTestId.registrationWizard.stepper.errorStep : undefined}>
            {t('registration.heading.description')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={highestVisitedTab >= RegistrationTab.ResourceType && !resourceTabHasError}>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.resourceStepButton}
          onClick={() => setTabNumber(RegistrationTab.ResourceType)}>
          <StepLabel
            error={resourceTabHasError}
            data-testid={resourceTabHasError ? dataTestId.registrationWizard.stepper.errorStep : undefined}>
            {t('registration.heading.resource_type')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={highestVisitedTab >= RegistrationTab.Contributors && !contributorTabHasError}>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.contributorsStepButton}
          onClick={() => setTabNumber(RegistrationTab.Contributors)}>
          <StepLabel
            error={contributorTabHasError}
            data-testid={contributorTabHasError ? dataTestId.registrationWizard.stepper.errorStep : undefined}>
            {t('registration.heading.contributors')}
          </StepLabel>
        </StepButton>
      </Step>
      <Step completed={highestVisitedTab >= RegistrationTab.FilesAndLicenses && !fileTabHasError}>
        <StepButton
          data-testid={dataTestId.registrationWizard.stepper.filesStepButton}
          onClick={() => setTabNumber(RegistrationTab.FilesAndLicenses)}>
          <StepLabel
            error={fileTabHasError}
            data-testid={fileTabHasError ? dataTestId.registrationWizard.stepper.errorStep : undefined}>
            {t('registration.heading.files_and_license')}
          </StepLabel>
        </StepButton>
      </Step>
    </Stepper>
  );
};
