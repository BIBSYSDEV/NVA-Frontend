import { useTranslation } from 'react-i18next';
import { SimpleCustomerInstitution } from '../../types/customerInstitution.types';
import { dataTestId } from '../../utils/dataTestIds';
import { BaseDialog } from '../_molecules/BaseDialog';

interface InstitutionContactInformationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isFetchingCustomers: boolean;
  institution: SimpleCustomerInstitution | undefined;
}

export const InstitutionContactInformationDialog = ({
  isOpen,
  onClose,
  institution,
  isFetchingCustomers = false,
}: InstitutionContactInformationDialogProps) => {
  const { t } = useTranslation();

  return (
    <BaseDialog
      open={isOpen}
      onClose={onClose}
      isFetchingData={isFetchingCustomers}
      dialogTitle={t('contact_point_for_institution')}
      dataTestId={dataTestId.institutionContactInformationDialog}>
      {institution?.displayName}
    </BaseDialog>
  );
};
