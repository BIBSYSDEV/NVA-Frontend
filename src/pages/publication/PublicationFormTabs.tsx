import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/TabPanel/LinkTab';
import { PublicationFormsData } from '../../types/form.types';

const a11yProps = (tabDescription: string) => {
  return {
    id: `nav-tab-${tabDescription}`,
    'aria-controls': `nav-tabpanel-${tabDescription}`,
    'data-testid': `nav-tabpanel-${tabDescription}`,
  };
};

interface PublicationFormTabsProps {
  handleTabChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
  tabNumber: number;
  errors: FormikErrors<PublicationFormsData>;
  touched: FormikTouched<PublicationFormsData>;
}

export const PublicationFormTabs: React.FC<PublicationFormTabsProps> = ({
  handleTabChange,
  tabNumber,
  errors,
  touched,
}) => {
  const { t } = useTranslation('publication');

  return (
    <Tabs
      variant="fullWidth"
      value={tabNumber}
      onChange={handleTabChange}
      aria-label="navigation"
      TabIndicatorProps={{ style: { backgroundColor: 'blue' } }}
      textColor="primary">
      <LinkTab
        label={`1. ${t('heading.description')}`}
        {...a11yProps('description')}
        error={hasTouchedError(errors.description, touched.description)}
      />
      <LinkTab
        label={`2. ${t('heading.references')}`}
        {...a11yProps('references')}
        error={hasTouchedError(errors.reference, touched.reference)}
      />
      <LinkTab
        label={`3. ${t('heading.contributors')}`}
        {...a11yProps('contributors')}
        error={hasTouchedError(errors.contributors, touched.contributors)}
      />
      <LinkTab label={`4. ${t('heading.files_and_license')}`} {...a11yProps('files-and-license')} />
      <LinkTab label={`5. ${t('heading.submission')}`} {...a11yProps('submission')} />
    </Tabs>
  );
};

const hasTouchedError = (errors: FormikErrors<any> | undefined, touched: FormikTouched<any> | undefined): boolean => {
  if (!errors || !touched) {
    return false;
  }

  const errorFieldNames = Object.keys(errors);
  return errorFieldNames.some(field => touched[field]);
};
