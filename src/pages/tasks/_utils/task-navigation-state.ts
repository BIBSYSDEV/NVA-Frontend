import { TaskNavigationLocationState } from '../../../types/locationState.types';
import { TicketType } from '../../../types/publication_types/ticket.types';

/**
 * Returns a new navigation state with the offset updated, preserving all other state fields.
 * @param locationState - The current location state to base the new state on.
 * @param offset - The offset of the ticket to navigate to.
 * @returns A new state object with the updated offset.
 */
export const updateNavigationOffset = (
  locationState: TaskNavigationLocationState,
  offset: number
): TaskNavigationLocationState => {
  return {
    ...locationState,
    ticketOffset: offset,
  };
};

/**
 * Builds the link state for a ticket list item.
 * Navigation state (offset and filters) is only included when both offset and ticket type filters are available,
 * which is only the case when navigating from the tasks page.
 * @param ticketType - The type of the ticket being navigated to.
 * @param previousSearch - The search string of the list page, used to restore the list URL when navigating back.
 * @param currentOffset - The position of the ticket in the current list.
 * @param selectedTicketTypes - The selected ticket type filters in the side panel.
 * @returns A partial state object for use as link state.
 */
export const buildTicketLinkState = (
  ticketType: TicketType,
  previousSearch: string,
  currentOffset: number | undefined,
  selectedTicketTypes: string[] | undefined
): Partial<TaskNavigationLocationState> => ({
  previousSearch,
  selectedTicketType: ticketType,
  ...(typeof currentOffset === 'number' && selectedTicketTypes
    ? { ticketTypeFilters: selectedTicketTypes, ticketOffset: currentOffset }
    : {}),
});
