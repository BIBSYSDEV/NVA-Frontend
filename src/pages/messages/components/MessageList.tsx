import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { MouseEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../api/roleApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { RootState } from '../../../redux/store';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { useDeleteTicketMessage } from '../../../utils/hooks/useDeleteTicketMessage';
import { getFullName, truncateName } from '../../../utils/user-helpers';
import { ticketColor } from './TicketListItem';

interface MessageListProps {
  ticket: Ticket;
  refetchData?: () => void;
  canDeleteMessage?: boolean;
}

export const TicketMessageList = ({ ticket, refetchData, canDeleteMessage }: MessageListProps) => {
  const messages = ticket.messages ?? [];
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user) ?? undefined;
  const deleteTicketMessageMutation = useDeleteTicketMessage(ticket.id, refetchData);

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
            canDeleteMessage={user && (canDeleteMessage || user.nvaUsername === message.sender)}
            backgroundColor={ticketColor[ticket.type]}
            onDelete={() => deleteTicketMessageMutation.mutateAsync(message.identifier)}
            isDeleting={deleteTicketMessageMutation.isPending}
            confirmDialogTitle={t('my_page.messages.delete_message')}
            confirmDialogContent={t('my_page.messages.delete_message_description')}
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
  canDeleteMessage?: boolean;
  onDelete?: () => Promise<boolean>;
  isDeleting?: boolean;
  confirmDialogTitle?: string;
  confirmDialogContent?: string;
}

export const MessageItem = ({
  text,
  date,
  username,
  backgroundColor,
  canDeleteMessage = false,
  onDelete,
  isDeleting,
  confirmDialogContent,
  confirmDialogTitle,
}: MessageItemProps) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
        <Typography sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Tooltip title={senderName ? senderName : t('common.unknown')}>
            <span style={{ marginRight: '0.5rem' }}>
              {senderQuery.isPending ? (
                <Skeleton sx={{ width: '8rem' }} />
              ) : (
                <b data-testid={dataTestId.registrationLandingPage.tasksPanel.messageSender}>
                  {senderName ? truncateName(senderName, 20) : <i>{t('common.unknown')}</i>}
                </b>
              )}
            </span>
          </Tooltip>
          <span data-testid={dataTestId.registrationLandingPage.tasksPanel.messageTimestamp}>{toDateString(date)}</span>
        </Typography>
        {canDeleteMessage && onDelete && (
          <section>
            <IconButton
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              data-testid={dataTestId.registrationLandingPage.tasksPanel.messageOptionsButton}
              aria-label="delete"
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
                data-testid={dataTestId.registrationLandingPage.tasksPanel.deleteMessageButton}
                disabled={!text}
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
        )}
      </Box>

      <Divider sx={{ mb: '0.5rem', bgcolor: 'primary.main' }} />

      <Box
        data-testid={dataTestId.registrationLandingPage.tasksPanel.messageText}
        component={typeof text === 'string' ? Typography : 'div'}>
        {text ? text : <i>{t('my_page.messages.message_deleted')}</i>}
      </Box>

      {onDelete && confirmDialogContent && confirmDialogTitle && (
        <ConfirmDialog
          open={showConfirmDialog}
          title={confirmDialogTitle}
          onAccept={async () => {
            const result = await onDelete();
            if (result) {
              setShowConfirmDialog(false);
            }
          }}
          isLoading={isDeleting}
          onCancel={() => setShowConfirmDialog(false)}>
          <Typography>{confirmDialogContent}</Typography>
        </ConfirmDialog>
      )}
    </Box>
  );
};
