import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RegistrationTab } from '../../types/registration.types';
import { MergeResultsWizardActions } from './MergeResultsWizardActions';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { MergeResultsWizardDescriptionTab } from './MergeResultsWizardDescriptionTab';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

export const MergeResultsWizard = () => {
  const { t } = useTranslation();
  const { activeTab, targetResult } = useContext(MergeResultsWizardContext);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: targetResult });

  console.log(1, getValues());

  const onSubmit: SubmitHandler<typeof targetResult> = (data) => console.log('SUBMIT', data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MergeResultsWizardHeader />
        <MergeResultsWizardStepper />

        {activeTab === RegistrationTab.Description ? (
          <MergeResultsWizardDescriptionTab register={register} setValue={setValue} />
        ) : activeTab === RegistrationTab.ResourceType ? (
          <p>{t('registration.heading.resource_type')}: TODO</p>
        ) : activeTab === RegistrationTab.Contributors ? (
          <p>{t('registration.heading.contributors')}: TODO</p>
        ) : activeTab === RegistrationTab.FilesAndLicenses ? (
          <p>{t('registration.heading.files_and_license')}: TODO</p>
        ) : null}

        <MergeResultsWizardActions />
      </form>
    </>
  );
};
