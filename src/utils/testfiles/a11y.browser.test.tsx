import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { colorContrastRuleId, expectNoA11yViolations } from './a11y';

const transparentImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const sectionName = 'Content';
const saveText = 'Save';
const lowContrastStyle = { color: '#999999', backgroundColor: '#ffffff' };
const lowContrastText = 'Low contrast';
const imageAltRuleId = 'image-alt';
const imageAltHelpUrlPattern = new RegExp(`https://dequeuniversity\\.com/rules/axe/[\\d.]+/${imageAltRuleId}`);

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

    expect(message).toContain('Found 1 accessibility violation(s)');
    expect(message).toContain(`${imageAltRuleId} (critical)`);
    expect(message).toMatch(imageAltHelpUrlPattern);
    expect(message).toContain('#logo');
  });

  test('fails on low color contrast', async () => {
    await render(<p style={lowContrastStyle}>{lowContrastText}</p>);

    const message = await getFailureMessage(expectNoA11yViolations());

    expect(message).toContain(`${colorContrastRuleId} (serious)`);
  });

  test('skips rules that are turned off for the check', async () => {
    await render(<p style={lowContrastStyle}>{lowContrastText}</p>);

    // NOTE: Turned off to test the override itself
    await expectNoA11yViolations(document.body, { rules: { [colorContrastRuleId]: { enabled: false } } });
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

    await expectNoA11yViolations(page.getByRole('region', { name: sectionName }));
  });

  test('finds violations inside the given container', async () => {
    await render(
      <section aria-label={sectionName}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- the missing alt text is the violation under test */}
        <img src={transparentImage} />
      </section>
    );

    const message = await getFailureMessage(expectNoA11yViolations(page.getByRole('region', { name: sectionName })));

    expect(message).toContain(imageAltRuleId);
  });
});
