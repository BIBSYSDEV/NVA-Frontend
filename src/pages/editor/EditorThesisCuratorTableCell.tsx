import { TableCell, IconButton, Popover, Typography, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LabelIcon from '@mui/icons-material/Label';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { InstitutionUser, RoleName, UserRole } from '../../types/user.types';
import { updateUser } from '../../api/roleApi';
import { setNotification } from '../../redux/notificationSlice';

interface EditorThesisCuratorTableCellProps {
  curator: InstitutionUser;
}

export const EditorThesisCuratorTableCell = ({ curator }: EditorThesisCuratorTableCellProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const initialThesisCurator = curator.roles.some((role) => role.rolename === RoleName.CuratorThesis);
  const initialEmbargoThesisCurator = curator.roles.some((role) => role.rolename === RoleName.CuratorThesisEmbargo);

  const [isThesisCurator, setIsThesisCurator] = useState(initialThesisCurator);
  const [isEmbargoThesisCurator, setIsEmbargoThesisCurator] = useState(initialEmbargoThesisCurator);

  const userMutation = useMutation({
    mutationFn: (roles: UserRole[]) =>
      updateUser(curator.username, {
        ...curator,
        roles,
      }),
    onSuccess: (_, roles) => {
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
      curator.roles = roles;
      setAnchorEl(null);
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' })),
  });

  return (
    <TableCell>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        title={t('editor.curators.edit_extended_responsibility')}>
        {initialEmbargoThesisCurator ? (
          <LabelIcon color="primary" />
        ) : initialThesisCurator ? (
          <LabelOutlinedIcon color="primary" />
        ) : (
          <MoreHorizIcon />
        )}
      </IconButton>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setIsThesisCurator(initialThesisCurator);
          setIsEmbargoThesisCurator(initialEmbargoThesisCurator);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ p: '1rem' }}
        slotProps={{ paper: { sx: { p: '1rem' } } }}>
        <Typography>{t('editor.curators.curator_has_extended_privileges')}</Typography>
        <FormGroup sx={{ display: 'flex', flexDirection: 'column', mt: '0.5rem', mb: '1rem' }}>
          <FormControlLabel
            label={t('registration.publication_types.Degree')}
            disabled={userMutation.isLoading}
            control={<Checkbox checked={isThesisCurator} />}
            onChange={() => {
              if (isThesisCurator && isEmbargoThesisCurator) {
                setIsEmbargoThesisCurator(false);
              }
              setIsThesisCurator(!isThesisCurator);
            }}
          />
          <FormControlLabel
            label={t('registration.files_and_license.embargo')}
            sx={{ ml: '1rem' }}
            disabled={!isThesisCurator || userMutation.isLoading}
            control={<Checkbox checked={isEmbargoThesisCurator} />}
            onChange={() => setIsEmbargoThesisCurator(!isEmbargoThesisCurator)}
          />
        </FormGroup>
        <LoadingButton
          variant="contained"
          loading={userMutation.isLoading}
          disabled={initialThesisCurator === isThesisCurator && initialEmbargoThesisCurator === isEmbargoThesisCurator}
          onClick={() => {
            let newRoles = [...curator.roles];
            if (initialThesisCurator && !isThesisCurator) {
              newRoles = newRoles.filter((role) => role.rolename !== RoleName.CuratorThesis);
            } else if (!initialThesisCurator && isThesisCurator) {
              newRoles.push({ type: 'Role', rolename: RoleName.CuratorThesis });
            }
            if (initialEmbargoThesisCurator && !isEmbargoThesisCurator) {
              newRoles = newRoles.filter((role) => role.rolename !== RoleName.CuratorThesisEmbargo);
            } else if (!initialEmbargoThesisCurator && isEmbargoThesisCurator && isThesisCurator) {
              newRoles.push({ type: 'Role', rolename: RoleName.CuratorThesisEmbargo });
            }
            userMutation.mutate(newRoles);
          }}>
          {t('common.save')}
        </LoadingButton>
      </Popover>
    </TableCell>
  );
};
