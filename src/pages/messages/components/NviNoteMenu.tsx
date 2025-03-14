import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { dataTestId } from '../../../utils/dataTestIds';

interface NviNoteMenuProps {
  onDelete: (() => Promise<void>) | undefined;
  isDeleting: boolean;
  deleteTitle: string;
  deleteDescription: string;
}

const menuId = 'nvi-note-menu';

export const NviNoteMenu = ({ onDelete, isDeleting, deleteTitle, deleteDescription }: NviNoteMenuProps) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <section>
      <IconButton
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        data-testid={dataTestId.tasksPage.nvi.noteOptionsButton}
        aria-label={t('common.show_more_options')}
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
          data-testid={dataTestId.tasksPage.nvi.deleteNoteButton}
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
        title={deleteTitle}
        onAccept={async () => {
          if (onDelete) {
            await onDelete();
          }
          setShowConfirmDialog(false);
        }}
        isLoading={isDeleting}
        onCancel={() => setShowConfirmDialog(false)}>
        <Typography>{deleteDescription}</Typography>
      </ConfirmDialog>
    </section>
  );
};
