import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFetchRegistration } from '../../../../api/hooks/useFetchRegistration';
import { updateRegistration } from '../../../../api/registrationApi';
import { MergeResultsWizard } from '../../../../components/merge_results/MergeResultsWizard';
import { PageSpinner } from '../../../../components/PageSpinner';
import { setNotification } from '../../../../redux/notificationSlice';
import { Registration } from '../../../../types/registration.types';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { updateRegistrationQueryData } from '../../../../utils/registration-helpers';

interface MergeSelectedRegistrationProps {
  targetRegistrationId: string;
  sourceRegistration: Registration;
  toggleDialog: () => void;
}

export const MergeSelectedRegistration = ({
  targetRegistrationId,
  sourceRegistration,
  toggleDialog,
}: MergeSelectedRegistrationProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const targetRegistrationQuery = useFetchRegistration(getIdentifierFromId(targetRegistrationId));

  const registrationMutation = useMutation({
    mutationFn: (values: Registration) => updateRegistration(values),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
    onSuccess: (response) => {
      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));
      if (response.data) {
        updateRegistrationQueryData(queryClient, response.data);
      }
      toggleDialog();
    },
  });

  if (targetRegistrationQuery.isPending) {
    return <PageSpinner aria-label={t('merge_results')} />;
  }

  const targetRegistration = targetRegistrationQuery.data;

  if (!targetRegistration) {
    return null;
  }

  return (
    <MergeResultsWizard
      sourceResult={sourceRegistration}
      targetResult={targetRegistration}
      onSave={async (data) => await registrationMutation.mutateAsync(data)}
      onCancel={toggleDialog}
    />
  );
};
