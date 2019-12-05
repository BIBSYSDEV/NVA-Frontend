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

interface PublicationFormTabsProps {
  handleTabChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
  tabNumber: number;
}

export const PublicationFormTabs: React.FC<PublicationFormTabsProps> = ({ handleTabChange, tabNumber }) => {
  const errors = useSelector((store: RootStore) => store.errors);
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
        data-testid="publication-tab"
        label={`1. ${t('heading.publication')}`}
        {...a11yProps('publication')}
        error={errors.publicationErrors && errors.publicationErrors.length > 0}
      />
      <LinkTab
        data-testid="description-tab"
        label={`2. ${t('heading.description')}`}
        {...a11yProps('description')}
        error={errors.descriptionErrors && errors.descriptionErrors.length > 0}
      />
      <LinkTab data-testid="references-tab" label={`3. ${t('heading.references')}`} {...a11yProps('references')} />
      <LinkTab
        data-testid="contributors-tab"
        label={`4. ${t('heading.contributors')}`}
        {...a11yProps('contributors')}
      />
      <LinkTab
        data-testid="files-and-license-tab"
        label={`5. ${t('heading.files_and_license')}`}
        {...a11yProps('files-and-license')}
      />
      <LinkTab data-testid="submission-tab" label={`6. ${t('heading.submission')}`} {...a11yProps('submission')} />
    </Tabs>
  );
};
