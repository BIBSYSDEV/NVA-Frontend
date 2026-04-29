import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { BaseDialog } from '../../_molecules/BaseDialog';
import { VerticalBox } from '../../styled/Wrappers';
import { useInstitutionUsersByRole } from '../hooks/useInstitutionUsersByRole';
import { ContactInformation } from './contact-information/ContactInformation';

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
  const { editor, institutionAdmin, nviCurators, isLoading: isFetchingUsers, isError } = useInstitutionUsersByRole(id);

  return (
    <BaseDialog
      open={isOpen}
      onClose={onClose}
      isLoading={isFetchingCustomers || isFetchingUsers}
      dialogTitle={t('contact_point_for_institution')}
      dataTestId={dataTestId.institutionContactInformationDialog}>
      {!id && !isFetchingCustomers ? (
        <Typography>{t('no_contact_information_for_institution')}</Typography>
      ) : isError ? (
        <Typography>{t('feedback.error.get_users_for_institution')}</Typography>
      ) : (
        <VerticalBox sx={{ gap: '1.5rem' }}>
          {editor && <ContactInformation roleName={t('my_page.roles.editor')} users={[editor]} />}
          {institutionAdmin && (
            <ContactInformation roleName={t('my_page.roles.institution_admin')} users={[institutionAdmin]} />
          )}
          {nviCurators && nviCurators.length > 0 && (
            <ContactInformation roleName={t('nvi_curators_at_main_unit')} users={nviCurators} />
          )}
        </VerticalBox>
      )}
    </BaseDialog>
  );
};
