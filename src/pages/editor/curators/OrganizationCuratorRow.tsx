import AddLinkIcon from '@mui/icons-material/AddLink';
import AdjustIcon from '@mui/icons-material/Adjust';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SchoolIcon from '@mui/icons-material/School';
import TaskIcon from '@mui/icons-material/Task';
import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InstitutionUser, RoleName } from '../../../types/user.types';
import { UserFormDialog } from '../../basic_data/institution_admin/edit_user/UserFormDialog';

interface OrganizationCuratorRowProps {
  curator: InstitutionUser;
  refetchCurators: () => void;
}

const curatorRolesConfig = [
  { rolename: RoleName.SupportCurator, color: 'generalSupportCase.main', SelectedIcon: MarkEmailReadIcon },
  { rolename: RoleName.PublishingCurator, color: 'publishingRequest.main', SelectedIcon: TaskIcon },
  { rolename: RoleName.CuratorThesis, color: 'publishingRequest.main', SelectedIcon: SchoolIcon },
  { rolename: RoleName.CuratorThesisEmbargo, color: 'publishingRequest.main', SelectedIcon: EventIcon },
  { rolename: RoleName.DoiCurator, color: 'doiRequest.main', SelectedIcon: AddLinkIcon },
  { rolename: RoleName.NviCurator, color: 'nvi.main', SelectedIcon: AdjustIcon },
];

export const OrganizationCuratorRow = ({ curator, refetchCurators }: OrganizationCuratorRowProps) => {
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
        bgcolor: 'background.default',
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
        alignItems: 'center',
        p: '0.375rem 0.5rem',
      }}>
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '10rem' }}>
        <Typography>
          {curator.givenName} {curator.familyName}
        </Typography>
        <IconButton
          title={t('editor.curators.edit_user')}
          onClick={toggleDialog}
          size="small"
          sx={{ bgcolor: 'secondary.light' }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {curatorRolesConfig.map(({ rolename, color, SelectedIcon }) => {
          const isSelected = curator.roles.some((userRole) => userRole.rolename === rolename);
          return (
            <Box
              key={rolename}
              sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center', opacity: isSelected ? 1 : 0.75 }}>
              {isSelected ? (
                <SelectedIcon sx={{ p: '0.125rem', borderRadius: '50%', bgcolor: color }} />
              ) : (
                <Box
                  sx={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    border: 'solid 2px',
                    borderColor: 'secondary.dark',
                  }}
                />
              )}
              <Typography>{t<any>(`editor.curators.role.${rolename}`)}</Typography>
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
