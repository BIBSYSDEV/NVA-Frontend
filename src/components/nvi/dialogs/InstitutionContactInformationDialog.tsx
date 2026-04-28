import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFullName } from '../../../utils/user-helpers';
import { BaseDialog } from '../../_molecules/BaseDialog';
import { VerticalBox } from '../../styled/Wrappers';
import { useInstitutionUsersByRole } from '../hooks/useInstitutionUsersByRole';
import { ContactInformationLayout } from './ContactInformationLayout';
import { CuratorName } from './CuratorName';
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
          {editor && (
            <RoleContactInformation
              roleName={t('my_page.roles.editor')}
              name={getFullName(editor.givenName, editor.familyName)}
              cristinId={editor.cristinId}
            />
          )}
          {institutionAdmin && (
            <RoleContactInformation
              roleName={t('my_page.roles.institution_admin')}
              name={getFullName(institutionAdmin.givenName, institutionAdmin.familyName)}
              cristinId={institutionAdmin.cristinId}
            />
          )}
          {nviCurators && nviCurators.length > 0 && (
            <ContactInformationLayout roleName={t('nvi_curators_at_main_unit')}>
              <VerticalBox
                sx={{ gap: '0.5rem', ...(nviCurators.length > 5 && { maxHeight: '9rem', overflowY: 'auto' }) }}>
                {nviCurators.map((curator) => (
                  <CuratorName
                    key={curator.username}
                    name={getFullName(curator.givenName, curator.familyName)}
                    cristinId={curator.cristinId}
                  />
                ))}
              </VerticalBox>
            </ContactInformationLayout>
          )}
        </VerticalBox>
      )}
    </BaseDialog>
  );
};
