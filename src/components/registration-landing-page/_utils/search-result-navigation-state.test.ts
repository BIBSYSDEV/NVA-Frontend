import { describe, expect, test } from 'vitest';
import { updateSearchResultOffset } from './search-result-navigation-state';

describe('updateSearchResultOffset', () => {
  test('updates the offset and search params while preserving other state fields', () => {
    const result = updateSearchResultOffset({ previousPath: '/search?query=test' }, 3, { query: 'test', from: 2 });
    expect(result.previousPath).toBe('/search?query=test');
    expect(result.searchResultOffsetState).toEqual({ currentOffset: 3, searchParams: { query: 'test', from: 2 } });
  });
});
