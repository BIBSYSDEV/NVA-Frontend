import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { MergeResultsWizardCategoryTab } from './MergeResultsWizardCategoryTab';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { MergeResultsWizardDescriptionTab } from './MergeResultsWizardDescriptionTab';

export const MergeResultsWizardContent = () => {
  const { t } = useTranslation();
  const { activeTab } = useContext(MergeResultsWizardContext);

  return (
    <>
      <Typography variant="h2" sx={{ display: { xs: 'none', sm: 'block' } }}>
        {t('basic_data.central_import.import_candidate')}
      </Typography>
      <Typography variant="h2" sx={{ display: { xs: 'none', sm: 'block' }, gridColumn: 3 }}>
        {t('published_result')}
      </Typography>

      {activeTab === RegistrationTab.Description ? (
        <MergeResultsWizardDescriptionTab />
      ) : activeTab === RegistrationTab.ResourceType ? (
        <MergeResultsWizardCategoryTab />
      ) : null}
    </>
  );
};
