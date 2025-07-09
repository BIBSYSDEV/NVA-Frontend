import { Step, StepButton, StepLabel, Stepper, Theme, useMediaQuery } from '@mui/material';
import deepmerge from 'deepmerge';
import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { RegistrationFormLocationState } from '../../types/locationState.types';
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
  const location = useLocation();
  const locationState = location.state as RegistrationFormLocationState;
  const maxVisitedTab = locationState?.highestValidatedTab ?? RegistrationTab.FilesAndLicenses;

  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  useEffect(() => {
    const highestValidatedTab = locationState?.highestValidatedTab ?? RegistrationTab.FilesAndLicenses;

    if (tabNumber > highestValidatedTab) {
      locationState.highestValidatedTab = tabNumber - 1; // Validate up to current tab

      // Set fields on previous tabs to touched
      const touchedFieldsOnMount = getTouchedTabFields(tabNumber - 1, valuesRef.current);
      setTouched(touchedFieldsOnMount);
    }

    // Set fields on current tab to touched
    return () => {
      if (tabNumber > highestValidatedTab) {
        locationState.highestValidatedTab = tabNumber; // Validate current tab
      }
      const touchedFieldsOnUnmount = getTouchedTabFields(tabNumber, valuesRef.current);
      setTouched(
        deepmerge.all([touchedRef.current, touchedFieldsOnUnmount], {
          // associatedArtifacts must keep sourceArray in cases where it contains both files and link
          arrayMerge: (destinationArray, sourceArray) => sourceArray,
        })
      );
    };
  }, [setTouched, tabNumber, locationState]);

  const tabErrors = getTabErrors(valuesRef.current, errors, touched);
  const descriptionTabHasError = tabErrors[RegistrationTab.Description].length > 0;
  const resourceTabHasError = tabErrors[RegistrationTab.ResourceType].length > 0;
  const contributorTabHasError = tabErrors[RegistrationTab.Contributors].length > 0;
  const fileTabHasError = tabErrors[RegistrationTab.FilesAndLicenses].length > 0;

  return isMobile ? null : (
    <Stepper nonLinear activeStep={tabNumber}>
      <Step completed={maxVisitedTab >= RegistrationTab.Description && !descriptionTabHasError}>
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
      <Step completed={maxVisitedTab >= RegistrationTab.ResourceType && !resourceTabHasError}>
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
      <Step completed={maxVisitedTab >= RegistrationTab.Contributors && !contributorTabHasError}>
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
      <Step completed={maxVisitedTab >= RegistrationTab.FilesAndLicenses && !fileTabHasError}>
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
