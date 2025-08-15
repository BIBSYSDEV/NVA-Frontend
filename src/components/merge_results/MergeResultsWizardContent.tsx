import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { MergeResultsWizardDescriptionTab } from './MergeResultsWizardDescriptionTab';

export const MergeResultsWizardContent = () => {
  const { t } = useTranslation();
  const { activeTab } = useContext(MergeResultsWizardContext);

  return activeTab === RegistrationTab.Description ? (
    <MergeResultsWizardDescriptionTab />
  ) : activeTab === RegistrationTab.ResourceType ? (
    <p>{t('registration.heading.resource_type')}: TODO</p>
  ) : activeTab === RegistrationTab.Contributors ? (
    <p>{t('registration.heading.contributors')}: TODO</p>
  ) : activeTab === RegistrationTab.FilesAndLicenses ? (
    <p>{t('registration.heading.files_and_license')}: TODO</p>
  ) : null;
};
