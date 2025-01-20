import { Box, Link as MuiLink, Tooltip, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { updateTicket } from '../../../api/registrationApi';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { StatusChip, TicketStatusChip } from '../../../components/StatusChip';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { PreviousSearchLocationState, SelectedTicketTypeLocationState } from '../../../types/locationState.types';
import { ExpandedPublishingTicket, ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { emptyRegistration, Registration } from '../../../types/registration.types';
import { toDateString, toDateStringWithTime } from '../../../utils/date-helpers';
import { getInitials } from '../../../utils/general-helpers';
import { convertToRegistrationSearchItem } from '../../../utils/registration-helpers';
import { getMyMessagesRegistrationPath, getTasksRegistrationPath, UrlPathTemplate } from '../../../utils/urlPaths';
import { getFullName } from '../../../utils/user-helpers';
import { StyledVerifiedContributor } from '../../registration/contributors_tab/ContributorIndicator';
import { DoiRequestMessagesColumn } from './DoiRequestMessagesColumn';
import { PublishingRequestMessagesColumn } from './PublishingRequestMessagesColumn';
import { SupportMessagesColumn } from './SupportMessagesColumn';

export const ticketColor = {
  UnpublishRequest: 'publishingRequest.main',
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
  GeneralSupportCase: 'generalSupportCase.main',
  Import: 'grey.300',
};

interface TicketListItemProps {
  ticket: ExpandedTicket;
}

export const TicketListItem = ({ ticket }: TicketListItemProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const { id, identifier, mainTitle, contributors, publicationInstance, status } = ticket.publication;
  const registrationCopy = {
    ...emptyRegistration,
    identifier,
    id,
    status,
    entityDescription: {
      mainTitle,
      contributors,
      reference: { publicationInstance: { type: publicationInstance?.type ?? '' } },
    },
  } as Registration;

  const assigneeFullName = ticket.assignee
    ? getFullName(
        ticket.assignee.preferredFirstName || ticket.assignee.firstName,
        ticket.assignee.preferredLastName || ticket.assignee.lastName
      )
    : '';

  const viewStatusMutation = useMutation({ mutationFn: () => updateTicket(ticket.id, { viewStatus: 'Read' }) });
  const viewedByUser = user?.nvaUsername && ticket.viewedBy.some((viewer) => viewer.username === user.nvaUsername);

  const isOnTasksPage = window.location.pathname === UrlPathTemplate.TasksDialogue;
  const isOnMyPageMessages = window.location.pathname === UrlPathTemplate.MyPageMyMessages;

  return (
    <SearchListItem
      key={ticket.id}
      sx={{
        borderLeftColor: ticketColor[ticket.type],
        p: 0,
        bgcolor: !viewedByUser ? 'secondary.main' : undefined,
      }}>
      <MuiLink
        component={Link}
        state={
          {
            previousSearch: window.location.search,
            selectedTicketType: ticket.type,
          } satisfies PreviousSearchLocationState & SelectedTicketTypeLocationState
        }
        to={{
          pathname: isOnTasksPage
            ? getTasksRegistrationPath(identifier)
            : isOnMyPageMessages
              ? getMyMessagesRegistrationPath(identifier)
              : '',
        }}
        onClick={() => {
          if (!viewedByUser) {
            // Set ticket to read after some time, to ensure the user will load the ticket with correct read status first
            new Promise<void>((resolve) =>
              setTimeout(() => {
                viewStatusMutation.mutate();
                resolve();
              }, 3_000)
            );
          }
        }}
        sx={{ width: '100%', textDecoration: 'none', p: '0.5rem 1rem' }}>
        <Box
          sx={{
            display: 'grid',
            gap: '0 1rem',
            gridTemplateColumns: { xs: '1fr', sm: '10fr 4fr 2fr 2fr 1fr' },
          }}>
          <RegistrationListItemContent registration={convertToRegistrationSearchItem(registrationCopy)} ticketView />
          {ticket.type === 'PublishingRequest' ? (
            <PublishingRequestMessagesColumn ticket={ticket as ExpandedPublishingTicket} />
          ) : ticket.type === 'DoiRequest' ? (
            <DoiRequestMessagesColumn ticket={ticket} showLastMessage />
          ) : ticket.type === 'GeneralSupportCase' ? (
            <SupportMessagesColumn ticket={ticket} />
          ) : (
            <div />
          )}

          {ticket.type === 'GeneralSupportCase' && isOnMyPageMessages ? (
            viewedByUser ? (
              <StatusChip text={t('common.read_past_tense')} icon="check" bgcolor="generalSupportCase.main" />
            ) : (
              <StatusChip text={t('common.unread')} icon="hourglass" />
            )
          ) : (
            <TicketStatusChip ticket={ticket} />
          )}

          <Typography lineHeight="2rem">
            <Tooltip title={t('common.created_at', { date: toDateStringWithTime(ticket.createdDate) })}>
              <span>{toDateString(ticket.createdDate)}</span>
            </Tooltip>
          </Typography>

          {assigneeFullName && (
            <Tooltip title={`${t('my_page.roles.curator')}: ${assigneeFullName}`}>
              <StyledVerifiedContributor>{getInitials(assigneeFullName)}</StyledVerifiedContributor>
            </Tooltip>
          )}
        </Box>
      </MuiLink>
    </SearchListItem>
  );
};
