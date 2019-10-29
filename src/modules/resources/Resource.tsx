import '../../styles/resource.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Tabs from '@material-ui/core/Tabs';

import LinkTab from '../../components/TabPanel/LinkTab';
import TabPanel from '../../components/TabPanel/TabPanel';
import ResourceWithFormik from './ResourceWithFormik';

const a11yProps = (tabNumber: number) => {
  return {
    id: `nav-tab-${tabNumber}`,
    'aria-controls': `nav-tabpanel-${tabNumber}`,
  };
};

const Resource: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [errors, setErrors] = useState<any>([]);
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleErrors = (errors: any[]) => {
    setErrors(errors);
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
        <LinkTab label={`1. ${t('Publication')}`} {...a11yProps(0)} error={errors && errors.length > 0} />
        <LinkTab label={`2. ${t('Description')}`} {...a11yProps(1)} />
        <LinkTab label={`3. ${t('References')}`} {...a11yProps(2)} />
        <LinkTab label={`4. ${t('Contributors')}`} {...a11yProps(3)} />
        <LinkTab label={`5. ${t('Files and Licenses')}`} {...a11yProps(4)} />
        <LinkTab label={`6. ${t('Submission')}`} {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} tabNumber={0}>
        {errors &&
          errors.map((error: any) => {
            return (
              <p key={error.path} style={{ color: 'red' }}>
                {error.path} : {error.name} - {error.message}
              </p>
            );
          })}
        <ResourceWithFormik handleErrors={handleErrors} />
      </TabPanel>
      <TabPanel value={value} tabNumber={1}>
        Page Two
      </TabPanel>
      <TabPanel value={value} tabNumber={2}>
        Page Three
      </TabPanel>
      <TabPanel value={value} tabNumber={3}>
        Page Four
      </TabPanel>
      <TabPanel value={value} tabNumber={4}>
        Page Five
      </TabPanel>
      <TabPanel value={value} tabNumber={5}>
        Page Six
      </TabPanel>
    </div>
  );
};

export default Resource;
