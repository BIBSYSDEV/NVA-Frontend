import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { BaseDialog } from '../_molecules/BaseDialog';

interface InstitutionContactInformationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstitutionContactInformationDialog = ({ isOpen, onClose }: InstitutionContactInformationDialogProps) => {
  const { t } = useTranslation();

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={t('contact_point_for_institution')}
      dataTestId={dataTestId.institutionContactInformationDialog}>
      hei
    </BaseDialog>
  );
};
