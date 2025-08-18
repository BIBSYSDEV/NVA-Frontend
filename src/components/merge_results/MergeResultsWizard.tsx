import { useMutation } from '@tanstack/react-query';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateRegistration } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';
import { Registration } from '../../types/registration.types';
import { MergeResultsWizardActions } from './MergeResultsWizardActions';
import { MergeResultsWizardContent } from './MergeResultsWizardContent';
import { MergeResultsWizardContextProvider } from './MergeResultsWizardContext';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

interface MergeResultsWizardProps {
  sourceResult: Registration;
  targetResult: Registration;
}

export const MergeResultsWizard = ({ sourceResult, targetResult }: MergeResultsWizardProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formMethods = useForm({ defaultValues: targetResult });

  const registrationMutation = useMutation({
    mutationFn: (values: Registration) => updateRegistration(values),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
  });

  const onSubmit: SubmitHandler<Registration> = async (data) => {
    // TODO: import
    await registrationMutation.mutateAsync(data);
  };

  return (
    <FormProvider {...formMethods}>
      <MergeResultsWizardContextProvider value={{ sourceResult }}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <MergeResultsWizardHeader />
          <MergeResultsWizardStepper />
          <MergeResultsWizardContent />
          <MergeResultsWizardActions />
        </form>
      </MergeResultsWizardContextProvider>
    </FormProvider>
  );
};
