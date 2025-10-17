import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { MergeResultsWizardCategoryTab } from './MergeResultsWizardCategoryTab';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { MergeResultsWizardContributorsTab } from './MergeResultsWizardContributorsTab';
import { MergeResultsWizardDescriptionTab } from './MergeResultsWizardDescriptionTab';
import { MergeResultsWizardFilesTab } from './MergeResultsWizardFilesTab';

export const MergeResultsWizardContent = () => {
  const { t } = useTranslation();
  const { activeTab, sourceHeading } = useContext(MergeResultsWizardContext);

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'none', md: 'block' } }}>
        {sourceHeading}
      </Typography>
      <Typography variant="h3" sx={{ display: { xs: 'none', md: 'block' }, gridColumn: 3 }}>
        {t('published_result')}
      </Typography>

      {activeTab === RegistrationTab.Description ? (
        <MergeResultsWizardDescriptionTab />
      ) : activeTab === RegistrationTab.ResourceType ? (
        <MergeResultsWizardCategoryTab />
      ) : activeTab === RegistrationTab.Contributors ? (
        <MergeResultsWizardContributorsTab />
      ) : activeTab === RegistrationTab.FilesAndLicenses ? (
        <MergeResultsWizardFilesTab />
      ) : null}
    </>
  );
};
