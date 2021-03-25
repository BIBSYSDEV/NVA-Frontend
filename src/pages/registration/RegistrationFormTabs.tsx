import { useFormikContext } from 'formik';
import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/LinkTab';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { ResourceFieldNames, DescriptionFieldNames } from '../../types/publicationFieldNames';
import {
  hasTouchedError,
  getAllFileFields,
  getAllContributorFields,
  mergeTouchedFields,
  touchedContributorTabFields,
  touchedDescriptionTabFields,
  touchedFilesTabFields,
  touchedResourceTabFields,
} from '../../utils/formik-helpers';

const StyledTabs = styled(Tabs)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    .MuiTabs-flexContainer {
      justify-content: center;
    }
  }
`;

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const resourceFieldNames = Object.values(ResourceFieldNames);

const noTouchedTab = -1;
type HighestTouchedTab = RegistrationTab | typeof noTouchedTab;

interface RegistrationFormTabsProps {
  setTabNumber: (newTab: RegistrationTab) => void;
  tabNumber: RegistrationTab;
}

export const RegistrationFormTabs: FC<RegistrationFormTabsProps> = ({ setTabNumber, tabNumber }) => {
  const { t } = useTranslation('registration');
  const { errors, touched, values, setTouched } = useFormikContext<Registration>();

  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  const highestPreviouslyTouchedTabRef = useRef<HighestTouchedTab>(noTouchedTab);

  useEffect(() => {
    // All fields for each tab
    const tabFields = {
      [RegistrationTab.Description]: () => touchedDescriptionTabFields,
      [RegistrationTab.ResourceType]: () =>
        touchedResourceTabFields(valuesRef.current.entityDescription.reference.publicationContext.type),
      [RegistrationTab.Contributors]: () =>
        touchedContributorTabFields(valuesRef.current.entityDescription.contributors),
      [RegistrationTab.FilesAndLicenses]: () => touchedFilesTabFields(valuesRef.current.fileSet.files),
    };

    if (tabNumber > highestPreviouslyTouchedTabRef.current) {
      // Avoid setting tabs to touched all the time
      if (tabNumber > highestPreviouslyTouchedTabRef.current) {
        highestPreviouslyTouchedTabRef.current = tabNumber;
      }

      // Set all fields on previous tabs to touched
      const fieldsToTouchOnMount = [touchedRef.current];
      for (let thisTab = RegistrationTab.Description; thisTab < tabNumber; thisTab++) {
        fieldsToTouchOnMount.push(tabFields[thisTab]());
      }
      const mergedFieldsOnMount = mergeTouchedFields(fieldsToTouchOnMount);
      setTouched(mergedFieldsOnMount);
    }

    // Set fields on current tab to touched
    return () => {
      const mergedFieldsOnUnmount = mergeTouchedFields([touchedRef.current, tabFields[tabNumber]()]);
      setTouched(mergedFieldsOnUnmount);
    };
  }, [setTouched, tabNumber]);

  return (
    <StyledTabs
      onChange={(_, value) => setTabNumber(value)}
      scrollButtons="auto"
      textColor="primary"
      indicatorColor="secondary"
      value={tabNumber}
      variant="scrollable">
      <LinkTab
        data-testid="nav-tabpanel-description"
        label={t('heading.description')}
        error={hasTouchedError(errors, touched, descriptionFieldNames)}
      />
      <LinkTab
        data-testid="nav-tabpanel-resource-type"
        label={t('heading.resource_type')}
        error={hasTouchedError(errors, touched, resourceFieldNames)}
      />

      <LinkTab
        data-testid="nav-tabpanel-contributors"
        label={t('heading.contributors')}
        error={hasTouchedError(
          errors,
          touched,
          getAllContributorFields(valuesRef.current.entityDescription.contributors)
        )}
      />
      <LinkTab
        data-testid="nav-tabpanel-files-and-license"
        label={t('heading.files_and_license')}
        error={hasTouchedError(errors, touched, getAllFileFields(valuesRef.current.fileSet.files))}
      />
    </StyledTabs>
  );
};
