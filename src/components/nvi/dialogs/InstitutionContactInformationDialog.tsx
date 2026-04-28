import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { BaseDialog } from '../../_molecules/BaseDialog';
import { VerticalBox } from '../../styled/Wrappers';
import { useInstitutionUsersByRole } from '../hooks/useInstitutionUsersByRole';
import { RoleContactInformation } from './RoleContactInformation';

interface InstitutionContactInformationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isFetchingCustomers: boolean;
  id: string | undefined;
}

export const InstitutionContactInformationDialog = ({
  isOpen,
  onClose,
  id,
  isFetchingCustomers = false,
}: InstitutionContactInformationDialogProps) => {
  const { t } = useTranslation();
  const { editor, institutionAdmin, nviCurators, isLoading: isFetchingUsers } = useInstitutionUsersByRole(id);

  return (
    <BaseDialog
      open={isOpen}
      onClose={onClose}
      isFetchingData={isFetchingCustomers || isFetchingUsers}
      dialogTitle={t('contact_point_for_institution')}
      dataTestId={dataTestId.institutionContactInformationDialog}>
      {!id && !isFetchingCustomers ? (
        <Typography>{t('no_contact_information_for_institution')}</Typography>
      ) : (
        <VerticalBox sx={{ gap: '1rem' }}>
          {editor && <RoleContactInformation roleName={t('my_page.roles.editor')} users={[editor]} />}
          {institutionAdmin && (
            <RoleContactInformation roleName={t('my_page.roles.institution_admin')} users={[institutionAdmin]} />
          )}
          {nviCurators && nviCurators.length > 0 && (
            <RoleContactInformation roleName={t('nvi_curators_at_main_unit')} users={nviCurators} />
          )}
        </VerticalBox>
      )}
    </BaseDialog>
  );
};
