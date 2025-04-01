import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDeleteTicketMessage } from '../../../utils/hooks/useDeleteTicketMessage';

interface MessageMenuProps {
  disableDelete: boolean;
  messageId: string;
  refetchData?: () => void;
}

const menuId = 'message-menu';

export const MessageMenu = ({ messageId, refetchData, disableDelete }: MessageMenuProps) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const deleteTicketMessageMutation = useDeleteTicketMessage(messageId, refetchData);

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <section>
      <IconButton
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        data-testid={dataTestId.registrationLandingPage.tasksPanel.messageOptionsButton}
        aria-label={t('common.delete')}
        size="small"
        sx={{ alignSelf: 'end' }}
        onClick={handleClickMenuAnchor}>
        <MoreVertIcon fontSize="inherit" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id={menuId}
        keepMounted
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <MenuItem
          data-testid={dataTestId.registrationLandingPage.tasksPanel.deleteMessageButton}
          disabled={!disableDelete}
          onClick={() => {
            setShowConfirmDialog(true);
            setAnchorEl(null);
          }}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>{t('common.delete')}</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={showConfirmDialog}
        title={t('my_page.messages.delete_message')}
        onAccept={async () => {
          await deleteTicketMessageMutation.mutateAsync();
          setShowConfirmDialog(false);
        }}
        isLoading={deleteTicketMessageMutation.isPending}
        onCancel={() => setShowConfirmDialog(false)}>
        <Typography>{t('my_page.messages.delete_message_description')}</Typography>
      </ConfirmDialog>
    </section>
  );
};
