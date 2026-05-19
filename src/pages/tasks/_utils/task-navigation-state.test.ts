import { describe, expect, test } from 'vitest';
import { TaskNavigationLocationState } from '../../../types/locationState.types';
import { buildTicketLinkState, updateNavigationOffset } from './task-navigation-state';

describe('updateNavigationOffset', () => {
  const baseState: TaskNavigationLocationState = {
    previousSearch: '?status=pending',
    selectedTicketType: 'DoiRequest',
    ticketTypeFilters: ['doiRequest'],
    ticketOffset: 3,
  };

  test('updates ticketOffset', () => {
    const result = updateNavigationOffset(baseState, 4);
    expect(result.ticketOffset).toBe(4);
  });

  test('preserves other state fields', () => {
    const result = updateNavigationOffset(baseState, 4);
    expect(result.previousSearch).toBe(baseState.previousSearch);
    expect(result.selectedTicketType).toBe(baseState.selectedTicketType);
    expect(result.ticketTypeFilters).toBe(baseState.ticketTypeFilters);
  });
});

describe('buildTicketLinkState', () => {
  test('includes navigation state when offset and filters are present', () => {
    const result = buildTicketLinkState('DoiRequest', '?status=pending', 2, ['doiRequest']);
    expect(result.ticketOffset).toBe(2);
    expect(result.ticketTypeFilters).toEqual(['doiRequest']);
  });

  test('always includes previousSearch and selectedTicketType', () => {
    const result = buildTicketLinkState('GeneralSupportCase', '?status=pending', undefined, undefined);
    expect(result.previousSearch).toBe('?status=pending');
    expect(result.selectedTicketType).toBe('GeneralSupportCase');
  });

  test('excludes navigation state when offset is undefined', () => {
    const result = buildTicketLinkState('DoiRequest', '', undefined, ['doiRequest']);
    expect(result.ticketOffset).toBeUndefined();
    expect(result.ticketTypeFilters).toBeUndefined();
  });

  test('excludes navigation state when selectedTicketTypes is undefined', () => {
    const result = buildTicketLinkState('DoiRequest', '', 2, undefined);
    expect(result.ticketOffset).toBeUndefined();
    expect(result.ticketTypeFilters).toBeUndefined();
  });
});
