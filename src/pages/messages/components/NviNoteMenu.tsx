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
}

export const NviNoteMenu = ({ onDelete, isDeleting }: NviNoteMenuProps) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <section>
        <IconButton
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          data-testid={dataTestId.tasksPage.nvi.noteOptionsButton}
          aria-label={t('common.delete')}
          size="small"
          sx={{ alignSelf: 'end' }}
          onClick={handleClickMenuAnchor}>
          <MoreVertIcon fontSize="inherit" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
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
      </section>

      <ConfirmDialog
        open={showConfirmDialog}
        title={t('tasks.nvi.delete_note')}
        onAccept={async () => {
          if (onDelete) {
            await onDelete();
          }
          setShowConfirmDialog(false);
        }}
        isLoading={isDeleting}
        onCancel={() => setShowConfirmDialog(false)}>
        <Typography>{t('tasks.nvi.delete_note_description')}</Typography>
      </ConfirmDialog>
    </>
  );
};
