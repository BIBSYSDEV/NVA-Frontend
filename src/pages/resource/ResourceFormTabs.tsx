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
  handleTabChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
  tabNumber: number;
}

export const ResourceFormTabs: React.FC<ResourceFormTabsProps> = ({ handleTabChange, tabNumber }) => {
  const errors = useSelector((store: RootStore) => store.errors);
  const { t } = useTranslation();

  return (
    <Tabs
      variant="fullWidth"
      value={tabNumber}
      onChange={handleTabChange}
      aria-label="navigation"
      TabIndicatorProps={{ style: { backgroundColor: 'blue' } }}
      textColor="primary">
      <LinkTab
        label={`1. ${t('publication:publication_heading')}`}
        {...a11yProps('publication')}
        error={errors.publicationErrors && errors.publicationErrors.length > 0}
      />
      <LinkTab
        label={`2. ${t('publication:description_heading')}`}
        {...a11yProps('description')}
        error={errors.descriptionErrors && errors.descriptionErrors.length > 0}
      />
      <LinkTab label={`3. ${t('publication:references_heading')}`} {...a11yProps('references')} />
      <LinkTab label={`4. ${t('publication:contributors_heading')}`} {...a11yProps('contributors')} />
      <LinkTab label={`5. ${t('publication:files_and_license_heading')}`} {...a11yProps('files-and-license')} />
      <LinkTab label={`6. ${t('publication:submission')}`} {...a11yProps('submission')} />
    </Tabs>
  );
};
