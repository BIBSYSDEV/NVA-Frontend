import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { EmphasizeSubstring } from './EmphasizeSubstring';

const boldFontWeight = '700';
const normalFontWeight = '400';

const getByExactText = (text: string) => page.getByText(text, { exact: true });

const getFontWeight = (text: string) => getComputedStyle(getByExactText(text).element()).fontWeight;

describe('EmphasizeSubstring', () => {
  test('renders the matching part in bold', async () => {
    await render(<EmphasizeSubstring text="Nasjonalt vitenarkiv" emphasized="vitenarkiv" />);

    await expect.element(getByExactText('vitenarkiv')).toBeVisible();
    expect(getFontWeight('vitenarkiv')).toBe(boldFontWeight);
    expect(getFontWeight('Nasjonalt')).toBe(normalFontWeight);
  });

  test('ignores case when matching', async () => {
    await render(<EmphasizeSubstring text="Nasjonalt Vitenarkiv" emphasized="vitenarkiv" />);

    await expect.element(getByExactText('Vitenarkiv')).toBeVisible();
    expect(getFontWeight('Vitenarkiv')).toBe(boldFontWeight);
  });

  test('renders the whole text in normal weight when nothing matches', async () => {
    await render(<EmphasizeSubstring text="Nasjonalt vitenarkiv" emphasized="forskning" />);

    await expect.element(getByExactText('Nasjonalt vitenarkiv')).toBeVisible();
    expect(getFontWeight('Nasjonalt vitenarkiv')).toBe(normalFontWeight);
  });
});
