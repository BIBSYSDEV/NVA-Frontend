import '../../styles/resource.scss';

import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Tabs from '@material-ui/core/Tabs';

import LinkTab from '../../components/TabPanel/LinkTab';
import TabPanel from '../../components/TabPanel/TabPanel';
import { initialValidatorState, validationReducer } from '../../reducers/validationReducer';
import ResourceWithFormik from './ResourceWithFormik';

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
        {errors.publicationErrors &&
          errors.publicationErrors.map((error: any) => {
            return (
              <p key={error.path} style={{ color: 'red' }}>
                {error.path} : {error.name} - {error.message}
              </p>
            );
          })}
        <ResourceWithFormik dispatch={dispatch} />
      </TabPanel>
      <TabPanel value={value} tabNumber={1} ariaLabel="description">
        Page Two
      </TabPanel>
      <TabPanel value={value} tabNumber={2} ariaLabel="references">
        Page Three
      </TabPanel>
      <TabPanel value={value} tabNumber={3} ariaLabel="contributors">
        Page Four
      </TabPanel>
      <TabPanel value={value} tabNumber={4} ariaLabel="files-and-licenses">
        Page Five
      </TabPanel>
      <TabPanel value={value} tabNumber={5} ariaLabel="submission">
        Page Six
      </TabPanel>
    </div>
  );
};

export default Resource;
