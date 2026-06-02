import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { TicketSearchParam } from '../../../api/searchApi';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { StyledTicketSearchFormGroup } from '../../../components/styled/Wrappers';
import { TicketTypeFilterButton } from '../../../components/TicketTypeFilterButton';
import { CustomerTicketAggregations, TicketTypeSelection } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { resetPaginationAndNavigate } from '../../../utils/searchHelpers';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { TicketTypeTag } from '../../messages/components/TicketTypeTag';
import { checkPages } from '../../messages/tasks-helpers';
import { useTicketTypeButtonConfigs } from '../_hooks/useTicketTypeButtonConfigs';

interface UserDialogueNavigationAccordionProps {
  ticketTypeToggles: TicketTypeSelection;
  setTicketTypeToggles: (ticketTypeToggles: TicketTypeSelection) => void;
  ticketsAggregations?: CustomerTicketAggregations;
}

export const UserDialogueNavigationAccordion = ({
  ticketTypeToggles,
  setTicketTypeToggles,
  ticketsAggregations,
}: UserDialogueNavigationAccordionProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { isOnTicketsPage } = checkPages(location.pathname);
  const buttonConfigs = useTicketTypeButtonConfigs(ticketsAggregations);

  const toggleTicketType = (key: keyof TicketTypeSelection) => {
    setTicketTypeToggles({ ...ticketTypeToggles, [key]: !ticketTypeToggles[key] });
    resetPaginationAndNavigate(searchParams, navigate);
  };

  return (
    <NavigationListAccordion
      title={t('tasks.user_dialog')}
      startIcon={<AssignmentIcon />}
      accordionPath={UrlPathTemplate.TasksDialogue}
      onClick={() => !isOnTicketsPage && searchParams.delete(TicketSearchParam.From)}
      dataTestId={dataTestId.tasksPage.userDialogAccordion}>
      <StyledTicketSearchFormGroup sx={{ gap: '0.5rem', mt: 0 }}>
        {buttonConfigs.map(({ ticketType, testId, badgeCount, ticketTypeKey, count }) => (
          <TicketTypeFilterButton
            key={ticketType}
            data-testid={testId}
            endIcon={<Badge badgeContent={badgeCount} />}
            isSelected={!!ticketTypeToggles[ticketTypeKey]}
            onClick={() => toggleTicketType(ticketTypeKey)}>
            <TicketTypeTag count={ticketTypeToggles[ticketTypeKey] && count ? count : undefined} type={ticketType} />
          </TicketTypeFilterButton>
        ))}
      </StyledTicketSearchFormGroup>
    </NavigationListAccordion>
  );
};
