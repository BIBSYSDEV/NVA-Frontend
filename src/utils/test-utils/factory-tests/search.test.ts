import { describe, expect, test } from 'vitest';
import { makeRegistrationSearchItem, makeSearchResponse, makeSearchResponse2 } from '../factories/search';

describe('makeSearchResponse', () => {
  test('sets the size to the number of hits', () => {
    const response = makeSearchResponse({ hits: [makeRegistrationSearchItem(), makeRegistrationSearchItem()] });

    expect(response.size).toBe(2);
  });

  test('keeps an explicit size, so a paginated response can report more matches than it holds', () => {
    const response = makeSearchResponse({ hits: [makeRegistrationSearchItem()], size: 50 });

    expect(response.size).toBe(50);
  });
});

describe('makeSearchResponse2', () => {
  test('sets the total hits to the number of hits', () => {
    const response = makeSearchResponse2({ hits: [makeRegistrationSearchItem(), makeRegistrationSearchItem()] });

    expect(response.totalHits).toBe(2);
  });

  test('keeps explicit total hits, so a paginated response can report more matches than it holds', () => {
    const response = makeSearchResponse2({ hits: [makeRegistrationSearchItem()], totalHits: 50 });

    expect(response.totalHits).toBe(50);
  });
});
