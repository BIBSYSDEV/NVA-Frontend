import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MergeResultsWizardActions } from './MergeResultsWizardActions';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

export const MergeResultsWizard = () => {
  const { t } = useTranslation();
  const { activeTab } = useContext(MergeResultsWizardContext);

  return (
    <>
      <MergeResultsWizardHeader />
      <MergeResultsWizardStepper />

      {activeTab === 0 ? (
        <p>{t('registration.heading.description')}: TODO</p>
      ) : activeTab === 1 ? (
        <p>{t('registration.heading.resource_type')}: TODO</p>
      ) : activeTab === 2 ? (
        <p>{t('registration.heading.contributors')}: TODO</p>
      ) : activeTab === 3 ? (
        <p>{t('registration.heading.files_and_license')}: TODO</p>
      ) : null}

      <MergeResultsWizardActions />
    </>
  );
};
