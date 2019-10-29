import '../../styles/resource.scss';

import React, { useState } from 'react';

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
  const [errors, setErrors] = useState();

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
        indicatorColor="primary"
        textColor="primary">
        <LinkTab label="Page One" {...a11yProps(0)} error={errors && errors.length > 0} />
        <LinkTab label="Page Two" {...a11yProps(1)} />
        <LinkTab label="Page Three" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} tabNumber={0}>
        <h1>Errors:</h1>
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
    </div>
  );
};

export default Resource;
