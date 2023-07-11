import { Box, Tooltip, Typography, Link as MuiLink } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { ExpandedPublishingTicket, ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { Registration, emptyRegistration } from '../../../types/registration.types';
import { PublishingRequestMessagesColumn } from './PublishingRequestMessagesColumn';
import { DoiRequestMessagesColumn } from './DoiRequestMessagesColumn';
import { SupportMessagesColumn } from './SupportMessagesColumn';
import { getFullName } from '../../../utils/user-helpers';
import { getContributorInitials } from '../../../utils/registration-helpers';
import { StyledVerifiedContributor } from '../../registration/contributors_tab/ContributorIndicator';
import { UrlPathTemplate, getMyMessagesRegistrationPath, getTasksRegistrationPath } from '../../../utils/urlPaths';
import { RootState } from '../../../redux/store';
import { updateTicket } from '../../../api/registrationApi';
import { getTimePeriodString } from '../../../utils/general-helpers';

export const ticketColor = {
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
  GeneralSupportCase: 'generalSupportCase.main',
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

  const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const ticketAge = getTimePeriodString(ticket.createdDate, getTodayDateString(), t);

  const assigneeFullName = ticket.assignee
    ? getFullName(
        ticket.assignee.preferredFirstName || ticket.assignee.firstName,
        ticket.assignee.preferredLastName || ticket.assignee.lastName
      )
    : '';

  const viewStatusMutation = useMutation({ mutationFn: () => updateTicket(ticket.id, { viewStatus: 'Read' }) });

  const viewedByUser = user?.nvaUsername && ticket.viewedBy.some((viewer) => viewer.username === user.nvaUsername);

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
        to={
          window.location.pathname === UrlPathTemplate.Tasks
            ? getTasksRegistrationPath(identifier)
            : window.location.pathname === UrlPathTemplate.MyPageMyMessages
            ? getMyMessagesRegistrationPath(identifier)
            : ''
        }
        onClick={() => {
          if (!viewedByUser) {
            viewStatusMutation.mutate();
          }
        }}
        sx={{ width: '100%', textDecoration: 'none', p: '0.5rem 1rem' }}>
        <Box
          sx={{
            display: 'grid',
            gap: '0 1rem',
            gridTemplateColumns: { xs: '1fr', sm: '10fr 4fr 2fr 2fr 1fr' },
          }}>
          <RegistrationListItemContent registration={registrationCopy} ticketView />
          {ticket.type === 'PublishingRequest' ? (
            <PublishingRequestMessagesColumn ticket={ticket as ExpandedPublishingTicket} />
          ) : ticket.type === 'DoiRequest' ? (
            <DoiRequestMessagesColumn ticket={ticket} />
          ) : ticket.type === 'GeneralSupportCase' ? (
            <SupportMessagesColumn ticket={ticket} />
          ) : (
            <div />
          )}
          <Typography lineHeight="2rem">{t(`my_page.messages.ticket_types.${ticket.status}`)}</Typography>
          <Typography lineHeight="2rem">{ticketAge}</Typography>
          {assigneeFullName && (
            <Tooltip title={`${t('my_page.roles.curator')}: ${assigneeFullName}`}>
              <StyledVerifiedContributor>{getContributorInitials(assigneeFullName)}</StyledVerifiedContributor>
            </Tooltip>
          )}
        </Box>
      </MuiLink>
    </SearchListItem>
  );
};
