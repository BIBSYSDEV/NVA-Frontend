import { useMutation } from '@tanstack/react-query';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { updateImportCandidateStatus, updateRegistration } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';
import { BasicDataLocationState, RegistrationFormLocationState } from '../../types/locationState.types';
import { Registration } from '../../types/registration.types';
import { getImportCandidatePath, getRegistrationWizardPath } from '../../utils/urlPaths';
import { MergeResultsWizardActions } from './MergeResultsWizardActions';
import { MergeResultsWizardContent } from './MergeResultsWizardContent';
import { MergeResultsWizardContextProvider } from './MergeResultsWizardContext';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

interface MergeResultsWizardProps {
  sourceResult: Registration;
  targetResult: Registration;
  onSave: SubmitHandler<Registration>;
}

export const MergeResultsWizard = ({ sourceResult, targetResult, onSave }: MergeResultsWizardProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as BasicDataLocationState;
  const formMethods = useForm({ defaultValues: targetResult });

  const registrationMutation = useMutation({
    mutationFn: (values: Registration) => updateRegistration(values),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
  });

  const importCandidateMutation = useMutation({
    mutationFn: () =>
      updateImportCandidateStatus(sourceResult.identifier, {
        candidateStatus: 'IMPORTED',
        nvaPublicationId: targetResult.id,
      }),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_import_status'), variant: 'error' })),
  });

  const onSubmit: SubmitHandler<Registration> = async (data) => {
    await registrationMutation.mutateAsync(data);
    await importCandidateMutation.mutateAsync();
    dispatch(setNotification({ message: t('feedback.success.merge_import_candidate'), variant: 'success' }));
    navigate(getRegistrationWizardPath(targetResult.identifier), {
      state: {
        ...locationState,
        previousPath: getImportCandidatePath(sourceResult.identifier),
      } satisfies RegistrationFormLocationState,
    });
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
