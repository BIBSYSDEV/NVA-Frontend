import '../../styles/pages/resource/resource.scss';

import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';

import LinkTab from '../../components/TabPanel/LinkTab';
import TabPanel from '../../components/TabPanel/TabPanel';
import { initialValidatorState, validationReducer } from '../../redux/reducers/validationReducer';
import PublicationPanel from './PublicationPanel';
import ResourceDescriptionForm from './ResourceDescriptionForm';

const a11yProps = (tabDescription: string) => {
  return {
    id: `nav-tab-${tabDescription}`,
    'aria-controls': `nav-tabpanel-${tabDescription}`,
  };
};

const Resource: React.FC = () => {
  const [value, setValue] = useState(0);
  const [errors, dispatch] = useReducer(validationReducer, initialValidatorState);
  const { t } = useTranslation();

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const goToNextPage = (value: number) => {
    setValue(value + 1);
  };

  return (
    <div className="resource">
      <Tabs
        variant="fullWidth"
        value={value}
        onChange={handleChange}
        aria-label="navigation"
        TabIndicatorProps={{ style: { backgroundColor: 'blue' } }}
        textColor="primary">
        <LinkTab
          label={`1. ${t('Publication')}`}
          {...a11yProps('publication')}
          error={errors.publicationErrors && errors.publicationErrors.length > 0}
        />
        <LinkTab label={`2. ${t('Description')}`} {...a11yProps('description')} />
        <LinkTab label={`3. ${t('References')}`} {...a11yProps('references')} />
        <LinkTab label={`4. ${t('Contributors')}`} {...a11yProps('contributors')} />
        <LinkTab label={`5. ${t('Files and Licenses')}`} {...a11yProps('files-and-licenses')} />
        <LinkTab label={`6. ${t('Submission')}`} {...a11yProps('submission')} />
      </Tabs>
      <TabPanel value={value} tabNumber={0} ariaLabel="publication">
        <PublicationPanel />
        {errors.publicationErrors &&
          errors.publicationErrors.map((error: any) => {
            return (
              <p key={error.path} style={{ color: 'red' }}>
                {error.path} : {error.name} - {error.message}
              </p>
            );
          })}
        <Button onClick={() => goToNextPage(value)}>{t('Next')}</Button>
      </TabPanel>
      <TabPanel value={value} tabNumber={1} ariaLabel="description">
        <ResourceDescriptionForm dispatch={dispatch} />
        <Button onClick={() => goToNextPage(value)}>{t('Next')}</Button>
      </TabPanel>
      <TabPanel value={value} tabNumber={2} ariaLabel="references">
        <div>Page Three</div>
        <Button onClick={() => goToNextPage(value)}>{t('Next')}</Button>
      </TabPanel>
      <TabPanel value={value} tabNumber={3} ariaLabel="contributors">
        <div>Page Four</div>
        <Button onClick={() => goToNextPage(value)}>{t('Next')}</Button>
      </TabPanel>
      <TabPanel value={value} tabNumber={4} ariaLabel="files-and-licenses">
        <div>Page Five</div>
        <Button onClick={() => goToNextPage(value)}>{t('Next')}</Button>
      </TabPanel>
      <TabPanel value={value} tabNumber={5} ariaLabel="submission">
        <div>Page Six</div>
        <Button onClick={() => goToNextPage(value)}>{t('Next')}</Button>
      </TabPanel>
    </div>
  );
};

export default Resource;
