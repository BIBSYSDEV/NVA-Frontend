import { Dialog, DialogContent } from '@mui/material';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { expectNoA11yViolations, getViolationSummary } from './a11y';

const transparentImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const sectionName = 'Content';
const saveText = 'Save';
const lowContrastStyle = { color: '#999999', backgroundColor: '#ffffff' };
const lowContrastText = 'Low contrast';
const smallTargetStyle = { width: 10, height: 10, padding: 0, margin: 0, border: 0 };
const firstSmallButtonLabel = 'Previous';
const secondSmallButtonLabel = 'Next';
const imageAltRuleId = 'image-alt';
const colorContrastRuleId = 'color-contrast';
const imageAltHelpUrlPattern = new RegExp(`https://dequeuniversity\\.com/rules/axe/[\\d.]+/${imageAltRuleId}`);

const getSection = () => page.getByRole('region', { name: sectionName });

const getFailureMessage = async (check: Promise<void>) => {
  try {
    await check;
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error('Expected the accessibility check to fail');
};

describe('expectNoA11yViolations', () => {
  test('passes for an accessible component', async () => {
    await render(<button>{saveText}</button>);

    await expectNoA11yViolations();
  });

  test('fails with the rule ID, impact, help URL and selector of each violation', async () => {
    // eslint-disable-next-line jsx-a11y/alt-text -- the missing alt text is the violation under test
    await render(<img id="logo" src={transparentImage} />);

    const message = await getFailureMessage(expectNoA11yViolations());

    expect(message).toContain(getViolationSummary(1));
    expect(message).toContain(`${imageAltRuleId} (critical)`);
    expect(message).toMatch(imageAltHelpUrlPattern);
    expect(message).toContain('#logo');
  });

  test('fails on low color contrast', async () => {
    await render(<p style={lowContrastStyle}>{lowContrastText}</p>);

    const message = await getFailureMessage(expectNoA11yViolations());

    expect(message).toContain(`${colorContrastRuleId} (serious)`);
  });

  test('fails on targets smaller than 24 by 24 pixels that are close together (WCAG 2.2)', async () => {
    await render(
      <>
        <button aria-label={firstSmallButtonLabel} style={smallTargetStyle} />
        <button aria-label={secondSmallButtonLabel} style={smallTargetStyle} />
      </>
    );

    const message = await getFailureMessage(expectNoA11yViolations());

    expect(message).toContain('target-size');
  });

  test('skips the given rules for the check', async () => {
    await render(<p style={lowContrastStyle}>{lowContrastText}</p>);

    // NOTE: Skipped to test the option itself
    await expectNoA11yViolations(document.body, { skippedRules: [colorContrastRuleId] });
  });

  test('only checks inside the given container', async () => {
    await render(
      <>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- a violation outside the container, which must be ignored */}
        <img src={transparentImage} />
        <section aria-label={sectionName}>
          <button>{saveText}</button>
        </section>
      </>
    );

    await expectNoA11yViolations(getSection());
  });

  test('finds violations inside the given container', async () => {
    await render(
      <section aria-label={sectionName}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- the missing alt text is the violation under test */}
        <img src={transparentImage} />
      </section>
    );

    const message = await getFailureMessage(expectNoA11yViolations(getSection()));

    expect(message).toContain(imageAltRuleId);
  });

  test('waits for a dialog to fade in before checking it', async () => {
    await render(
      <Dialog open>
        <DialogContent>
          <p style={lowContrastStyle}>{lowContrastText}</p>
        </DialogContent>
      </Dialog>
    );

    const message = await getFailureMessage(expectNoA11yViolations(page.getByRole('dialog')));

    expect(message).toContain(colorContrastRuleId);
  });
});
