import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
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
        <p>{t('registration.heading.resource_type')}: TODO</p>
      ) : activeTab === RegistrationTab.Contributors ? (
        <p>{t('registration.heading.contributors')}: TODO</p>
      ) : activeTab === RegistrationTab.FilesAndLicenses ? (
        <p>{t('registration.heading.files_and_license')}: TODO</p>
      ) : null}
    </>
  );
};
