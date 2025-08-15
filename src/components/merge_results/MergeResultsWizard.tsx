import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { MergeResultsWizardActions } from './MergeResultsWizardActions';
import { MergeResultsWizardContext, MergeResultsWizardContextProvider } from './MergeResultsWizardContext';
import { MergeResultsWizardDescriptionTab } from './MergeResultsWizardDescriptionTab';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

interface MergeResultsWizardProps {
  sourceResult: Registration;
  targetResult: Registration;
}

export const MergeResultsWizard = ({ sourceResult, targetResult }: MergeResultsWizardProps) => {
  const { t } = useTranslation();
  const { activeTab } = useContext(MergeResultsWizardContext);

  const form = useForm({ defaultValues: targetResult });

  const onSubmit: SubmitHandler<typeof targetResult> = (data) => console.log('SUBMIT', data);

  return (
    <>
      <MergeResultsWizardContextProvider value={{ sourceResult, targetResult, form }}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <MergeResultsWizardHeader />
          <MergeResultsWizardStepper />

          {activeTab === RegistrationTab.Description ? (
            <MergeResultsWizardDescriptionTab />
          ) : activeTab === RegistrationTab.ResourceType ? (
            <p>{t('registration.heading.resource_type')}: TODO</p>
          ) : activeTab === RegistrationTab.Contributors ? (
            <p>{t('registration.heading.contributors')}: TODO</p>
          ) : activeTab === RegistrationTab.FilesAndLicenses ? (
            <p>{t('registration.heading.files_and_license')}: TODO</p>
          ) : null}

          <MergeResultsWizardActions />
        </form>
      </MergeResultsWizardContextProvider>
    </>
  );
};
