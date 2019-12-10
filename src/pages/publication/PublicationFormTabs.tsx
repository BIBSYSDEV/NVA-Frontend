import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/TabPanel/LinkTab';

const a11yProps = (tabDescription: string) => {
  return {
    id: `nav-tab-${tabDescription}`,
    'aria-controls': `nav-tabpanel-${tabDescription}`,
  };
};

interface PublicationFormTabsProps {
  handleTabChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
  tabNumber: number;
  errors: any;
  touched: any;
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
      <LinkTab label={`1. ${t('heading.publication')}`} {...a11yProps('publication')} />
      <LinkTab
        label={`2. ${t('heading.description')}`}
        {...a11yProps('description')}
        error={errors.description && touched.description}
      />
      <LinkTab
        label={`3. ${t('heading.references')}`}
        {...a11yProps('references')}
        error={errors.reference && touched.reference}
      />
      <LinkTab
        label={`4. ${t('heading.contributors')}`}
        {...a11yProps('contributors')}
        error={errors.contributors && touched.contributors}
      />
      <LinkTab label={`5. ${t('heading.files_and_license')}`} {...a11yProps('files-and-license')} />
      <LinkTab label={`6. ${t('heading.submission')}`} {...a11yProps('submission')} />
    </Tabs>
  );
};
