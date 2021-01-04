import { useFormikContext } from 'formik';
import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/LinkTab';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { ReferenceFieldNames, DescriptionFieldNames } from '../../types/publicationFieldNames';
import {
  hasTouchedError,
  getAllFileFields,
  getAllContributorFields,
  mergeTouchedFields,
  touchedContributorTabFields,
  touchedDescriptionTabFields,
  touchedFilesTabFields,
  touchedReferenceTabFields,
} from '../../utils/formik-helpers';

const StyledTabs = styled(Tabs)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    .MuiTabs-flexContainer {
      justify-content: center;
    }
  }
`;

const a11yProps = (tabDescription: string) => {
  return {
    id: `nav-tab-${tabDescription}`,
    'aria-controls': `nav-tabpanel-${tabDescription}`,
    'data-testid': `nav-tabpanel-${tabDescription}`,
  };
};

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const referenceFieldNames = Object.values(ReferenceFieldNames);

enum ToucedTab {
  None = -1,
}
type HighestTouchedTab = RegistrationTab | NoTouchedTab;

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

  const highestPreviouslyTouchedTabRef = useRef<HighestTouchedTab>(-1);

  useEffect(() => {
    // All fields for each tab
    const tabFields = {
      [RegistrationTab.Description]: () => touchedDescriptionTabFields,
      [RegistrationTab.Reference]: () =>
        touchedReferenceTabFields(valuesRef.current.entityDescription.reference.publicationContext.type),
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
      aria-label="navigation"
      onChange={(_, value) => setTabNumber(value)}
      scrollButtons="auto"
      textColor="primary"
      indicatorColor="primary"
      value={tabNumber}
      variant="scrollable">
      <LinkTab
        label={t('heading.description')}
        {...a11yProps('description')}
        error={hasTouchedError(errors, touched, descriptionFieldNames)}
      />
      <LinkTab
        label={t('heading.reference')}
        {...a11yProps('reference')}
        error={hasTouchedError(errors, touched, referenceFieldNames)}
      />

      <LinkTab
        label={t('heading.contributors')}
        {...a11yProps('contributors')}
        error={hasTouchedError(
          errors,
          touched,
          getAllContributorFields(valuesRef.current.entityDescription.contributors)
        )}
      />
      <LinkTab
        label={t('heading.files_and_license')}
        {...a11yProps('files-and-license')}
        error={hasTouchedError(errors, touched, getAllFileFields(valuesRef.current.fileSet.files))}
      />
    </StyledTabs>
  );
};
