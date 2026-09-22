import { describe, expect, it } from 'vitest';
import { bibtexExportFormat, csvExportFormat, jsonLdExportFormat } from './exportFormats';

describe('bibtexExportFormat.combine', () => {
  it('joins pages with a newline', () => {
    expect(bibtexExportFormat.combine(['@article{a}', '@book{b}'])).toBe('@article{a}\n@book{b}');
  });
});

describe('csvExportFormat.combine', () => {
  it('returns a single page unchanged', () => {
    expect(csvExportFormat.combine(['"title"\n"a"'])).toBe('"title"\n"a"');
  });

  it('keeps the header from the first page and strips it from the rest', () => {
    expect(csvExportFormat.combine(['"title"\n"a"', '"title"\n"b"'])).toBe('"title"\n"a"\n"b"');
  });

  it('drops empty and whitespace-only pages', () => {
    expect(csvExportFormat.combine(['"title"\n"a"', '   ', ''])).toBe('"title"\n"a"');
  });

  it('drops a trailing page that contains only the header row', () => {
    expect(csvExportFormat.combine(['"title"\n"a"', '"title"'])).toBe('"title"\n"a"');
  });

  it('returns an empty string when there are no pages', () => {
    expect(csvExportFormat.combine([])).toBe('');
  });
});

describe('jsonLdExportFormat.combine', () => {
  const page = (numberOfItems: number, items: unknown[]) =>
    JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', numberOfItems, itemListElement: items });

  it('merges itemListElement across pages and keeps the list-level metadata', () => {
    const result = JSON.parse(jsonLdExportFormat.combine([page(3, [{ a: 1 }, { a: 2 }]), page(3, [{ a: 3 }])]));
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('ItemList');
    expect(result.itemListElement).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });

  it('sets numberOfItems to the actual merged count, not the backend total (truncated export)', () => {
    const result = JSON.parse(jsonLdExportFormat.combine([page(9999, [{ a: 1 }, { a: 2 }])]));
    expect(result.numberOfItems).toBe(2);
  });

  it('skips empty pages instead of failing to parse them', () => {
    const result = JSON.parse(jsonLdExportFormat.combine([page(1, [{ a: 1 }]), '   ']));
    expect(result.numberOfItems).toBe(1);
    expect(result.itemListElement).toEqual([{ a: 1 }]);
  });
});
