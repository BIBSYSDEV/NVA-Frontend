import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { getTabErrors, getFirstErrorTab, getTouchedTabFields, mergeTouchedFields } from '../../utils/formik-helpers';
import { ErrorList } from './ErrorList';
import { RequiredDescription } from '../../components/RequiredDescription';
import { RegistrationLocationState } from './RegistrationForm';

interface RegistrationFormTabsProps {
  setTabNumber: (newTab: RegistrationTab) => void;
  tabNumber: RegistrationTab;
}

export const RegistrationFormTabs = ({ setTabNumber, tabNumber }: RegistrationFormTabsProps) => {
  const { t } = useTranslation('registration');
  const { errors, touched, values, setTouched } = useFormikContext<Registration>();
  const locationState = useLocation<RegistrationLocationState>().state;
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
      locationState.highestValidatedTab = tabNumber;

      // Set fields on previous tabs to touched
      const touchedFieldsOnMount = getTouchedTabFields(tabNumber - 1, valuesRef.current);
      setTouched(touchedFieldsOnMount);
    }

    // Set fields on current tab to touched
    return () => {
      const touchedFieldsOnUnmount = getTouchedTabFields(tabNumber, valuesRef.current);
      setTouched(mergeTouchedFields([touchedRef.current, touchedFieldsOnUnmount]));
    };
  }, [setTouched, tabNumber, locationState]);

  const tabErrors = getTabErrors(valuesRef.current, errors, touched);

  const descriptionTabHasError = tabErrors[RegistrationTab.Description].length > 0;
  const resourceTabHasError = tabErrors[RegistrationTab.ResourceType].length > 0;
  const contributorTabHasError = tabErrors[RegistrationTab.Contributors].length > 0;
  const fileTabHasError = tabErrors[RegistrationTab.FilesAndLicenses].length > 0;

  return (
    <>
      <Stepper nonLinear activeStep={tabNumber}>
        <Step completed={maxVisitedTab > RegistrationTab.Description && !descriptionTabHasError}>
          <StepButton data-testid="nav-tabpanel-description" onClick={() => setTabNumber(RegistrationTab.Description)}>
            <StepLabel error={descriptionTabHasError} data-testid={descriptionTabHasError ? 'error-tab' : undefined}>
              {t('heading.description')}
            </StepLabel>
          </StepButton>
        </Step>
        <Step completed={maxVisitedTab > RegistrationTab.ResourceType && !resourceTabHasError}>
          <StepButton
            data-testid="nav-tabpanel-resource-type"
            onClick={() => setTabNumber(RegistrationTab.ResourceType)}>
            <StepLabel error={resourceTabHasError} data-testid={resourceTabHasError ? 'error-tab' : undefined}>
              {t('heading.resource_type')}
            </StepLabel>
          </StepButton>
        </Step>
        <Step completed={maxVisitedTab > RegistrationTab.Contributors && !contributorTabHasError}>
          <StepButton
            data-testid="nav-tabpanel-contributors"
            onClick={() => setTabNumber(RegistrationTab.Contributors)}>
            <StepLabel error={contributorTabHasError} data-testid={contributorTabHasError ? 'error-tab' : undefined}>
              {t('heading.contributors')}
            </StepLabel>
          </StepButton>
        </Step>
        <Step completed={maxVisitedTab > RegistrationTab.FilesAndLicenses && !fileTabHasError}>
          <StepButton
            data-testid="nav-tabpanel-files-and-license"
            onClick={() => setTabNumber(RegistrationTab.FilesAndLicenses)}>
            <StepLabel error={fileTabHasError} data-testid={fileTabHasError ? 'error-tab' : undefined}>
              {t('heading.files_and_license')}
            </StepLabel>
          </StepButton>
        </Step>
      </Stepper>

      <RequiredDescription />

      {getFirstErrorTab(tabErrors) > -1 && (
        <ErrorList
          tabErrors={tabErrors}
          description={
            <Typography variant="h4" component="h2">
              {t('validation_errors')}
            </Typography>
          }
        />
      )}
    </>
  );
};
