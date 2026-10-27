import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  expectEscapeToCloseAndRestoreFocus,
  expectFocusTrapped,
  expectFocusWithin,
  expectTabOrder,
  focusOutsideContainerMessage,
  noFocusableElementsMessage,
} from './keyboardFocus';

const openDialogText = 'Open dialog';
const openMenuText = 'Open menu';
const cancelText = 'Cancel';
const saveText = 'Save';
const firstText = 'First';
const secondText = 'Second';
const insideText = 'Content';
const outsideText = 'Outside';
const insideButtonText = 'Inside';
const dialogTitleText = 'Dialog';
const focusAssertionPattern = /toHaveFocus/;
const containAssertionPattern = /toContainElement/;
const removedAssertionPattern = /toBeInTheDocument/;
// NOTE: Without an explicit timeout, a failing expect.element keeps retrying until the test times out, so failing cases get a short test timeout
const failingCaseTestOptions = { timeout: 2000 };

const DialogWithTrigger = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{openDialogText}</Button>
      <Dialog open={open} onClose={close}>
        <DialogTitle>{dialogTitleText}</DialogTitle>
        <DialogContent>{insideText}</DialogContent>
        <DialogActions>
          <Button onClick={close}>{cancelText}</Button>
          <Button onClick={close}>{saveText}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const MenuWithTrigger = () => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const close = () => setAnchorElement(null);

  return (
    <>
      <Button onClick={(event) => setAnchorElement(event.currentTarget)}>{openMenuText}</Button>
      <Menu anchorEl={anchorElement} open={!!anchorElement} onClose={close}>
        <MenuItem onClick={close}>{firstText}</MenuItem>
        <MenuItem onClick={close}>{secondText}</MenuItem>
      </Menu>
    </>
  );
};

const DialogWithoutFocusRestore = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{openDialogText}</Button>
      <Dialog open={open} onClose={() => setOpen(false)} disableRestoreFocus>
        <DialogTitle>{dialogTitleText}</DialogTitle>
      </Dialog>
    </>
  );
};

const getButton = (name: string) => page.getByRole('button', { name });

describe('expectTabOrder', () => {
  test('passes when focus follows the given order', async () => {
    await render(
      <>
        <button>{firstText}</button>
        <button>{secondText}</button>
      </>
    );

    await expectTabOrder([getButton(firstText), getButton(secondText)]);
  });

  test('fails when focus follows another order', async () => {
    await render(
      <>
        <button>{firstText}</button>
        {/* eslint-disable-next-line jsx-a11y/tabindex-no-positive -- moves this button first in the tab order */}
        <button tabIndex={1}>{secondText}</button>
      </>
    );

    await expect(expectTabOrder([getButton(firstText), getButton(secondText)])).rejects.toThrow(focusAssertionPattern);
  });
});

describe('expectFocusWithin', () => {
  test('passes when focus is inside the container', async () => {
    await render(
      <section aria-label={insideText}>
        <button>{insideButtonText}</button>
      </section>
    );

    await getButton(insideButtonText).click();

    await expectFocusWithin(page.getByRole('region'));
  });

  test('fails when focus is outside the container', async () => {
    await render(
      <>
        <button>{outsideText}</button>
        <section aria-label={insideText}>{insideText}</section>
      </>
    );

    await expect(expectFocusWithin(page.getByRole('region'))).rejects.toThrow(focusOutsideContainerMessage);
  });
});

describe('expectFocusTrapped', () => {
  test('passes when focus stays inside the container', async () => {
    await render(<DialogWithTrigger />);
    const dialog = page.getByRole('dialog');

    await getButton(openDialogText).click();
    await expectFocusWithin(dialog);

    await expectFocusTrapped(dialog);
  });

  test('fails when focus can leave the container', async () => {
    await render(
      <>
        <section aria-label={insideText}>
          <button>{insideButtonText}</button>
        </section>
        <button>{outsideText}</button>
      </>
    );

    await expect(expectFocusTrapped(page.getByRole('region'))).rejects.toThrow(containAssertionPattern);
  });

  test('fails when the container has no focusable elements', async () => {
    await render(<section aria-label={insideText}>{insideText}</section>);

    await expect(expectFocusTrapped(page.getByRole('region'))).rejects.toThrow(noFocusableElementsMessage);
  });
});

describe('expectEscapeToCloseAndRestoreFocus', () => {
  test('passes when Escape closes the popup and focus returns to the trigger', async () => {
    await render(<DialogWithTrigger />);
    const trigger = getButton(openDialogText);
    const dialog = page.getByRole('dialog');

    await trigger.click();
    await expectFocusWithin(dialog);

    await expectEscapeToCloseAndRestoreFocus(dialog, trigger);
  });

  test('fails when Escape does not close the popup', failingCaseTestOptions, async () => {
    await render(
      <>
        <button>{openDialogText}</button>
        <div role="dialog" aria-label={dialogTitleText}>
          <button>{insideButtonText}</button>
        </div>
      </>
    );

    await getButton(insideButtonText).click();

    await expect(
      expectEscapeToCloseAndRestoreFocus(page.getByRole('dialog'), getButton(openDialogText))
    ).rejects.toThrow(removedAssertionPattern);
  });

  test('fails when focus does not return to the trigger', failingCaseTestOptions, async () => {
    await render(<DialogWithoutFocusRestore />);
    const trigger = getButton(openDialogText);
    const dialog = page.getByRole('dialog');

    await trigger.click();
    await expectFocusWithin(dialog);

    await expect(expectEscapeToCloseAndRestoreFocus(dialog, trigger)).rejects.toThrow(focusAssertionPattern);
  });
});

describe('keyboard patterns for MUI components', () => {
  test('dialog takes focus, traps it, closes on Escape and returns focus to the trigger', async () => {
    await render(<DialogWithTrigger />);
    const trigger = getButton(openDialogText);
    const dialog = page.getByRole('dialog');

    await trigger.click();
    await expectFocusWithin(dialog);
    await expectFocusTrapped(dialog);
    await expectEscapeToCloseAndRestoreFocus(dialog, trigger);
  });

  test('menu takes focus, closes on Escape and returns focus to the trigger', async () => {
    await render(<MenuWithTrigger />);
    const trigger = getButton(openMenuText);
    const menu = page.getByRole('menu');

    await trigger.click();
    await expectFocusWithin(menu);
    await expectEscapeToCloseAndRestoreFocus(menu, trigger);
  });
});
