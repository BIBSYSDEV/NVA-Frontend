import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/TabPanel/LinkTab';
import { RootStore } from '../../redux/reducers/rootReducer';

const a11yProps = (tabDescription: string) => {
  return {
    id: `nav-tab-${tabDescription}`,
    'aria-controls': `nav-tabpanel-${tabDescription}`,
  };
};

interface ResourceFormTabsProps {
  onChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
  tabNumber: number;
}

export const ResourceFormTabs: React.FC<ResourceFormTabsProps> = ({ onChange, tabNumber }) => {
  const errors = useSelector((store: RootStore) => store.errors);
  const { t } = useTranslation();

  return (
    <Tabs
      variant="fullWidth"
      value={tabNumber}
      onChange={onChange}
      aria-label="navigation"
      TabIndicatorProps={{ style: { backgroundColor: 'blue' } }}
      textColor="primary">
      <LinkTab
        label={`1. ${t('Publication')}`}
        {...a11yProps('publication')}
        error={errors.publicationErrors && errors.publicationErrors.length > 0}
      />
      <LinkTab
        label={`2. ${t('Description')}`}
        {...a11yProps('description')}
        error={errors.descriptionErrors && errors.descriptionErrors.length > 0}
      />
      <LinkTab label={`3. ${t('References')}`} {...a11yProps('references')} />
      <LinkTab label={`4. ${t('Contributors')}`} {...a11yProps('contributors')} />
      <LinkTab label={`5. ${t('Files and Licenses')}`} {...a11yProps('files-and-licenses')} />
      <LinkTab label={`6. ${t('Submission')}`} {...a11yProps('submission')} />
    </Tabs>
  );
};
