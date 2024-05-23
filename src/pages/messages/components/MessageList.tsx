import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MouseEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTicketMessage } from '../../../api/registrationApi';
import { fetchUser } from '../../../api/roleApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFullName } from '../../../utils/user-helpers';
import { ticketColor } from './TicketListItem';

interface MessageListProps {
  ticket: Ticket;
}

export const TicketMessageList = ({ ticket }: MessageListProps) => {
  const messages = ticket.messages ?? [];
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => deleteTicketMessage(ticket.id, messageId),
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.delete_note'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.delete_note'), variant: 'error' })),
  });

  return (
    <ErrorBoundary>
      <Box
        component="ul"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          listStyleType: 'none',
          p: 0,
          m: 0,
          gap: '0.25rem',
        }}>
        {messages.map((message) => (
          <MessageItem
            key={message.identifier}
            text={message.text}
            date={message.createdDate}
            username={message.sender}
            backgroundColor={ticketColor[ticket.type]}
            onDelete={() => deleteMessageMutation.mutate(message.identifier)}
          />
        ))}
      </Box>
    </ErrorBoundary>
  );
};

interface MessageItemProps {
  text: ReactNode;
  date: string;
  username: string;
  backgroundColor: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const MessageItem = ({ text, date, username, backgroundColor, onDelete, isDeleting }: MessageItemProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((store: RootState) => store.user);
  const canDeleteMessage = user && (user.nvaUsername === username || user.isSupportCurator || user.isNviCurator);

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const senderQuery = useQuery({
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const senderName = getFullName(senderQuery.data?.givenName, senderQuery.data?.familyName);

  return (
    <Box
      component="li"
      sx={{
        bgcolor: backgroundColor,
        p: '0.5rem',
        borderRadius: '4px',
        cursor: onDelete && !expanded ? 'pointer' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => setExpanded(true)}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
        <Typography sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <span>
            {senderQuery.isPending ? (
              <Skeleton sx={{ width: '8rem' }} />
            ) : (
              <b data-testid={dataTestId.registrationLandingPage.tasksPanel.messageSender}>
                {senderName ? senderName : <i>{t('common.unknown')}</i>}
              </b>
            )}
          </span>
          <span data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>
            {new Date(date).toLocaleDateString()}
          </span>
        </Typography>
        {canDeleteMessage && (
          <>
            <IconButton
              data-testid={dataTestId.registrationLandingPage.tasksPanel.messageOptionsButton}
              aria-label="delete"
              size="small"
              sx={{ alignSelf: 'end' }}
              onClick={handleClickMenuAnchor}>
              <MoreVertIcon fontSize="inherit" />
            </IconButton>
            <MuiMenu
              anchorEl={anchorEl}
              keepMounted
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}>
              <MenuItem
                data-testid={dataTestId.registrationLandingPage.tasksPanel.deleteMessageButton}
                onClick={() => setShowConfirmDialog(true)}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText>{t('common.delete')}</ListItemText>
              </MenuItem>
            </MuiMenu>
          </>
        )}
      </Box>

      <Divider sx={{ mb: '0.5rem', bgcolor: 'primary.main' }} />

      <Box
        data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}
        component={typeof text === 'string' ? Typography : 'div'}>
        {text ? text : <Typography fontStyle="italic">{t('common.deleted')}</Typography>}
      </Box>

      {expanded && onDelete && (
        <>
          <Button
            size="small"
            disabled={showConfirmDialog}
            variant="outlined"
            sx={{ mt: '0.25rem', alignSelf: 'center' }}
            onClick={() => setShowConfirmDialog(true)}>
            {t('common.delete')}
          </Button>

          <ConfirmDialog
            open={showConfirmDialog}
            title={t('tasks.nvi.delete_note')}
            onAccept={onDelete}
            isLoading={isDeleting}
            onCancel={() => setShowConfirmDialog(false)}>
            <Typography>{t('tasks.nvi.delete_note_description')}</Typography>
          </ConfirmDialog>
        </>
      )}
    </Box>
  );
};
