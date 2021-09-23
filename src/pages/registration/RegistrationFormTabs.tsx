import { useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tabs, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { Registration, RegistrationTab } from '../../types/registration.types';
import { getTabErrors, getFirstErrorTab, getTouchedTabFields, mergeTouchedFields } from '../../utils/formik-helpers';
import { ErrorList } from './ErrorList';
import { RequiredDescription } from '../../components/RequiredDescription';
import { LinkTab } from '../../components/LinkTab';
import { RegistrationLocationState } from './RegistrationForm';

const StyledTabs = styled(Tabs)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    .MuiTabs-flexContainer {
      justify-content: space-around;
    }
  }
`;

interface RegistrationFormTabsProps {
  setTabNumber: (newTab: RegistrationTab) => void;
  tabNumber: RegistrationTab;
}

export const RegistrationFormTabs = ({ setTabNumber, tabNumber }: RegistrationFormTabsProps) => {
  const { t } = useTranslation('registration');
  const { errors, touched, values, setTouched } = useFormikContext<Registration>();
  const locationState = useLocation<RegistrationLocationState>().state;

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

  return (
    <>
      <StyledTabs
        onChange={(_, value) => setTabNumber(value)}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="secondary"
        value={tabNumber}>
        <LinkTab
          data-testid="nav-tabpanel-description"
          label={t('heading.description')}
          error={tabErrors[RegistrationTab.Description].length > 0}
        />
        <LinkTab
          data-testid="nav-tabpanel-resource-type"
          label={t('heading.resource_type')}
          error={tabErrors[RegistrationTab.ResourceType].length > 0}
        />
        <LinkTab
          data-testid="nav-tabpanel-contributors"
          label={t('heading.contributors')}
          error={tabErrors[RegistrationTab.Contributors].length > 0}
        />
        <LinkTab
          data-testid="nav-tabpanel-files-and-license"
          label={t('heading.files_and_license')}
          error={tabErrors[RegistrationTab.FilesAndLicenses].length > 0}
        />
      </StyledTabs>

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
