import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Box, IconButton, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from 'react';
import { Ticket } from '../../../types/publication_types/ticket.types';
import { fetchUser, fetchUsers } from '../../../api/roleApi';
import { getFullName } from '../../../utils/user-helpers';
import { RootState } from '../../../redux/store';
import { updateTicket } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { getContributorInitials } from '../../../utils/registration-helpers';
import { ticketColor } from '../../messages/components/TicketListItem';
import { StyledBaseContributorIndicator } from '../../registration/contributors_tab/ContributorIndicator';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface TicketAssigneeProps {
  ticket: Ticket;
  refetchTickets: () => void;
}

export const TicketAssignee = ({ ticket, refetchTickets }: TicketAssigneeProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootState) => store);
  const customerId = user?.customerId ?? '';

  const [showCuratorSearch, setShowCuratorSearch] = useState(false);

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId],
    enabled: showCuratorSearch && !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, RoleName.Curator) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  // Ensure current user is first in list of curators
  const curatorOptions = (curatorsQuery.data ?? []).sort((a, b) =>
    a.username === user?.nvaUsername ? -1 : b.username === user?.nvaUsername ? 1 : 0
  );

  const assigneeQuery = useQuery({
    enabled: !!ticket.assignee,
    queryKey: [ticket.assignee],
    queryFn: () => (ticket.assignee ? fetchUser(ticket.assignee) : undefined),
    meta: { errorMessage: t('feedback.error.get_person') },
  });
  const assigneeName = getFullName(assigneeQuery.data?.givenName, assigneeQuery.data?.familyName);
  const assigneeInitials = getContributorInitials(assigneeName);

  const ticketMutation = useMutation({
    mutationFn: async (assigneeUsername: string) => await updateTicket(ticket.id, { assignee: assigneeUsername }),
    onSuccess: () => {
      refetchTickets();
      dispatch(setNotification({ message: t('feedback.success.update_ticket_assignee'), variant: 'success' }));
      setShowCuratorSearch(false);
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_ticket_assignee'), variant: 'error' })),
  });

  const canSetAssignee =
    window.location.pathname.startsWith(UrlPathTemplate.Tasks) &&
    user?.isCurator &&
    (ticket.status === 'Pending' || ticket.status === 'New');

  return showCuratorSearch ? (
    <Autocomplete
      options={curatorOptions}
      renderOption={(props, option) => (
        <li {...props} key={option.username}>
          {getFullName(option.givenName, option.familyName)}
        </li>
      )}
      disabled={ticketMutation.isLoading || curatorsQuery.isLoading}
      filterOptions={(options, state) => {
        const filter = state.inputValue.toLocaleLowerCase();
        return options.filter((option) => {
          const name = getFullName(option.givenName, option.familyName).toLocaleLowerCase();
          return name.includes(filter);
        });
      }}
      onChange={async (_, value) => await ticketMutation.mutateAsync(value?.username ?? '')}
      onBlur={() => setShowCuratorSearch(false)}
      getOptionLabel={(option) => getFullName(option.givenName, option.familyName)}
      isOptionEqualToValue={(option, value) => option.username === value.username}
      value={assigneeQuery.data}
      loading={assigneeQuery.isLoading}
      sx={{ mb: '0.5rem' }}
      renderInput={(params) => (
        <AutocompleteTextField
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeSearchField}
          {...params}
          label={t('my_page.roles.curator')}
          isLoading={curatorsQuery.isLoading}
          placeholder={t('common.search')}
          showSearchIcon
        />
      )}
    />
  ) : (
    <Box sx={{ height: '1.75rem', display: 'flex', gap: '0.5rem', mb: '0.5rem' }}>
      <Tooltip title={`${t('my_page.roles.curator')}: ${ticket.assignee ? assigneeName : t('common.none')}`}>
        <StyledBaseContributorIndicator
          sx={{ bgcolor: ticketColor[ticket.type] }}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeIndicator}>
          {ticket.assignee ? assigneeInitials : ''}
        </StyledBaseContributorIndicator>
      </Tooltip>
      {canSetAssignee && (
        <IconButton
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeButton}
          title={t('registration.public_page.tasks_panel.assign_curator')}
          onClick={() => setShowCuratorSearch(true)}>
          <MoreHorizIcon />
        </IconButton>
      )}
    </Box>
  );
};
