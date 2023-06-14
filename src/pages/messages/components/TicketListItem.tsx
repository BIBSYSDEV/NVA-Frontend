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
  const { user } = useSelector((store: RootState) => store);

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
  const msAge = new Date().getTime() - new Date(ticket.modifiedDate).getTime();
  const daysAge = Math.ceil(msAge / 86_400_000); // 1000 * 60 * 60 * 24 = 86_400_000 ms in one day

  const assigneeFullName = ticket.assignee
    ? getFullName(
        ticket.assignee.preferredFirstName || ticket.assignee.firstName,
        ticket.assignee.preferredLastName || ticket.assignee.lastName
      )
    : '';

  const ticketViewStatusMutation = useMutation({ mutationFn: () => updateTicket(ticket.id, { viewStatus: 'Read' }) });

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
            ticketViewStatusMutation.mutate();
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
          <Typography lineHeight="2rem">{t('common.x_days', { count: daysAge })}</Typography>
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
