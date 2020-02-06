import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import FormCard from '../../components/FormCard/FormCard';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import TabPanel from '../../components/TabPanel/TabPanel';
import AddContributor from './contributors_tab/AddContributor';
import SortableTable from './contributors_tab/components/SortableTable';
import contributors from '../../utils/testfiles/contributors.json';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
}

const ContributorsPanel: FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');

  const createData = (name: any, corresponding: any, institution: any) => {
    return { name, corresponding, institution };
  };

  const rows = [
    createData('Karoline Olsen', true, 'NTNU'),
    createData('Anne Berit Nilsen', false, 'UiO'),
    createData('Erik Olsen', false, 'UiB'),
    createData('Kari Nordmann', false, 'NTNU'),
  ];

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
      <FormCard>
        <FormCardHeading>{t('contributors.authors')}</FormCardHeading>
        <SortableTable listOfContributors={contributors} />
        <AddContributor />
      </FormCard>
    </TabPanel>
  );
};

export default ContributorsPanel;
