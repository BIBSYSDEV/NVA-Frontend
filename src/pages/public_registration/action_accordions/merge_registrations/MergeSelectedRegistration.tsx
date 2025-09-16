import { useTranslation } from 'react-i18next';
import { useFetchRegistration } from '../../../../api/hooks/useFetchRegistration';
import { useUpdateRegistration } from '../../../../api/hooks/useUpdateRegistration';
import { MergeResultsWizard } from '../../../../components/merge_results/MergeResultsWizard';
import { PageSpinner } from '../../../../components/PageSpinner';
import { Registration } from '../../../../types/registration.types';
import { getIdentifierFromId } from '../../../../utils/general-helpers';

interface MergeSelectedRegistrationProps {
  targetRegistrationId: string;
  sourceRegistration: Registration;
  resetTargetRegistrationId: () => void;
  toggleDialog: () => void;
}

export const MergeSelectedRegistration = ({
  targetRegistrationId,
  sourceRegistration,
  resetTargetRegistrationId,
  toggleDialog,
}: MergeSelectedRegistrationProps) => {
  const { t } = useTranslation();

  const targetRegistrationQuery = useFetchRegistration(getIdentifierFromId(targetRegistrationId));
  const registrationMutation = useUpdateRegistration({ onSuccess: toggleDialog });

  if (targetRegistrationQuery.isPending) {
    return <PageSpinner aria-label={t('merge_results')} />;
  }

  const targetRegistration = targetRegistrationQuery.data;

  if (!targetRegistration) {
    return null;
  }

  if (!targetRegistration.allowedOperations?.includes('update')) {
    resetTargetRegistrationId();
    dispatch(setNotification({ message: t('you_do_not_have_permission_to_edit_this_registration'), variant: 'info' }));
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
