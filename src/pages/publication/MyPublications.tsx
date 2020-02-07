import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from '../../components/FormCard/FormCard';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import LinkTab from '../../components/TabPanel/LinkTab';
import { Tabs } from '@material-ui/core';
import PublicationList from './PublicationList';

export interface DummyPublicationListElement {
  id: string;
  title: string;
  date: string;
  status: string;
}

const MyPublications: FC = () => {
  const { t } = useTranslation();

  const [tabNumber, setTabNumber] = useState(0);

  const handleTabChange = (_: React.ChangeEvent<{}>, newTabNumber: number) => {
    setTabNumber(newTabNumber);
  };

  const a11yProps = (tabDescription: string) => {
    return {
      id: `my-publication-tab-${tabDescription}`,
      'aria-controls': `nav-tabpanel-${tabDescription}`,
      'data-testid': `nav-tabpanel-${tabDescription}`,
    };
  };

  let dummyElement: DummyPublicationListElement = {
    id: '5843058934095834905.',
    title: 'Qualitative research practice: A guide for social science students and researchers.',
    status: 'Kladd',
    date: '02.09.2010',
  };
  let dummyElementList = [dummyElement, dummyElement, dummyElement, dummyElement, dummyElement];

  return (
    <FormCard>
      <FormCardHeading>{t('workLists:my_publications')}</FormCardHeading>
      <Tabs variant="fullWidth" value={0} onChange={handleTabChange} aria-label="My publication tabs">
        <LinkTab label={t('workLists:unpublished_publications')} {...a11yProps('dummyElementList')} />
      </Tabs>
      {tabNumber === 0 && <PublicationList elements={dummyElementList} />}
    </FormCard>
  );
};

export default MyPublications;
