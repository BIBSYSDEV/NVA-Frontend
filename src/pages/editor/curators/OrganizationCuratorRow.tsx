import AddLinkIcon from '@mui/icons-material/AddLink';
import AdjustIcon from '@mui/icons-material/Adjust';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SchoolIcon from '@mui/icons-material/School';
import TaskIcon from '@mui/icons-material/Task';
import { Box, IconButton, Typography } from '@mui/material';
import { ComponentType, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFullName } from '../../../utils/user-helpers';
import { UserFormDialog } from '../../basic_data/institution_admin/edit_user/UserFormDialog';
import { OrganizationCuratorsProps } from './OrganizationCurators';

interface OrganizationCuratorRowProps extends Pick<OrganizationCuratorsProps, 'canEditUsers'> {
  curator: InstitutionUser;
  refetchCurators: () => void;
}

const curatorRolesConfig = [
  { rolename: RoleName.SupportCurator, SelectedIcon: MarkEmailReadIcon },
  { rolename: RoleName.PublishingCurator, SelectedIcon: TaskIcon },
  { rolename: RoleName.CuratorThesis, SelectedIcon: SchoolIcon },
  { rolename: RoleName.CuratorThesisEmbargo, SelectedIcon: EventIcon },
  { rolename: RoleName.DoiCurator, SelectedIcon: AddLinkIcon },
  { rolename: RoleName.NviCurator, SelectedIcon: AdjustIcon },
] satisfies {
  rolename:
    | RoleName.SupportCurator
    | RoleName.PublishingCurator
    | RoleName.CuratorThesis
    | RoleName.CuratorThesisEmbargo
    | RoleName.DoiCurator
    | RoleName.NviCurator;
  SelectedIcon: ComponentType<any>;
}[];

export const OrganizationCuratorRow = ({ curator, refetchCurators, canEditUsers }: OrganizationCuratorRowProps) => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => {
    if (openDialog) {
      refetchCurators();
    }
    setOpenDialog(!openDialog);
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
        alignItems: 'center',
        p: '0.375rem 0.5rem',
      }}>
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '10rem' }}>
        <Typography>{getFullName(curator.givenName, curator.familyName)}</Typography>
        {canEditUsers && (
          <IconButton
            data-testid={dataTestId.editor.editUserButton}
            title={t('editor.curators.edit_user')}
            onClick={toggleDialog}
            size="small"
            sx={{ bgcolor: 'tertiary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {curatorRolesConfig.map(({ rolename, SelectedIcon }) => {
          const isSelected = curator.roles.some((userRole) => userRole.rolename === rolename);
          return (
            <Box key={rolename} sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              {isSelected ? (
                <SelectedIcon sx={{ p: '0.125rem', borderRadius: '50%', bgcolor: 'secondary.main', color: 'white' }} />
              ) : (
                <Box
                  sx={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    bgcolor: 'grey.300',
                  }}
                />
              )}
              <Typography sx={{ opacity: isSelected ? 1 : 0.75 }}>{t(`editor.curators.role.${rolename}`)}</Typography>
            </Box>
          );
        })}
      </Box>

      {curator.cristinId && (
        <UserFormDialog
          open={openDialog}
          onClose={toggleDialog}
          existingPerson={curator.cristinId}
          existingUser={curator}
        />
      )}
    </Box>
  );
};
