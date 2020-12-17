import { FormikTouched, setNestedObjectValues, useFormikContext } from 'formik';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
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

interface RegistrationFormTabsProps {
  setTabNumber: (newTab: number) => void;
  tabNumber: RegistrationTab;
  isNewRegistration: boolean;
}

export const RegistrationFormTabs: FC<RegistrationFormTabsProps> = ({ setTabNumber, tabNumber, isNewRegistration }) => {
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

  const highestPreviouslyTouchedTabRef = useRef<RegistrationTab | -1>(-1);
  useEffect(() => {
    console.log('useEffect', tabNumber);
    if (tabNumber > highestPreviouslyTouchedTabRef.current) {
      const fieldsToTouch = [touchedRef.current];
      if (tabNumber > RegistrationTab.Description) {
        console.log('touch desc');
        fieldsToTouch.push(touchedDescriptionTabFields);
      }
      if (tabNumber > RegistrationTab.Reference) {
        console.log('touch ref');
        fieldsToTouch.push(
          touchedReferenceTabFields(valuesRef.current.entityDescription.reference.publicationContext.type)
        );
      }
      if (tabNumber > RegistrationTab.Contributors) {
        console.log('touch cont');
        fieldsToTouch.push(touchedContributorTabFields(valuesRef.current.entityDescription.contributors));
      }

      if (tabNumber > highestPreviouslyTouchedTabRef.current) {
        highestPreviouslyTouchedTabRef.current = tabNumber;
      }
      setTouched(mergeTouchedFields(fieldsToTouch));

      return () => {
        if (tabNumber === RegistrationTab.FilesAndLicenses) {
          console.log('touch file');
          setTouched(mergeTouchedFields([touchedRef.current, touchedFilesTabFields(valuesRef.current.fileSet.files)]));
        }
      };
    }
  }, [setTouched, tabNumber]);

  console.log('highest tab', highestPreviouslyTouchedTabRef.current);
  isNewRegistration = true;
  useEffect(() => {
    // TODO: avoid error changes to trigger this forever
    console.log('useeffect newReg');
    if (!isNewRegistration) {
      setTouched(setNestedObjectValues(errors, true));
    }
  }, [setTouched, isNewRegistration, errors]);

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
