import { describe, expect, test } from 'vitest';
import { buildTicketLinkState } from './task-navigation-state';

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
