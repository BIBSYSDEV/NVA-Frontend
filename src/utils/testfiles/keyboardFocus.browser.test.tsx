import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import { type KeyboardEvent, useState } from 'react';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  expectEscapeToCloseAndRestoreFocus,
  expectFocusTrapped,
  expectFocusWithin,
  expectTabOrder,
  focusNotMovingMessage,
  focusOutsideContainerMessage,
  noElementsMessage,
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
const tabKey = 'Tab';
const focusAssertionPattern = /toHaveFocus/;
const containAssertionPattern = /toContainElement/;
const removedAssertionPattern = /toBeInTheDocument/;
// NOTE: A failing expect.element waits for a missing element until the test times out,
// so failing cases get a short test timeout
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
const getDialog = () => page.getByRole('dialog');
const getRegion = () => page.getByRole('region');

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

  test('fails when focus follows another order', failingCaseTestOptions, async () => {
    await render(
      <>
        <button>{firstText}</button>
        {/* eslint-disable-next-line jsx-a11y/tabindex-no-positive -- moves this button first in the tab order */}
        <button tabIndex={1}>{secondText}</button>
      </>
    );

    await expect(expectTabOrder([getButton(firstText), getButton(secondText)])).rejects.toThrow(focusAssertionPattern);
  });

  test('fails when no elements are given', async () => {
    await expect(expectTabOrder([])).rejects.toThrow(noElementsMessage);
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

    await expectFocusWithin(getRegion());
  });

  test('fails when focus is outside the container', async () => {
    await render(
      <>
        <button>{outsideText}</button>
        <section aria-label={insideText}>{insideText}</section>
      </>
    );

    await expect(expectFocusWithin(getRegion())).rejects.toThrow(focusOutsideContainerMessage);
  });
});

describe('expectFocusTrapped', () => {
  test('passes when focus stays inside the container', async () => {
    await render(<DialogWithTrigger />);
    const dialog = getDialog();

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

    await getButton(insideButtonText).click();

    await expect(expectFocusTrapped(getRegion())).rejects.toThrow(containAssertionPattern);
  });

  test('fails when focus starts outside the container', failingCaseTestOptions, async () => {
    await render(
      <>
        <button>{outsideText}</button>
        <section aria-label={insideText}>
          <button>{insideButtonText}</button>
        </section>
      </>
    );

    await getButton(outsideText).click();

    await expect(expectFocusTrapped(getRegion())).rejects.toThrow(focusOutsideContainerMessage);
  });

  test('fails when Tab does not move focus', async () => {
    const preventTab = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === tabKey) {
        event.preventDefault();
      }
    };

    await render(
      <section aria-label={insideText}>
        <button onKeyDown={preventTab}>{firstText}</button>
        <button onKeyDown={preventTab}>{secondText}</button>
      </section>
    );

    await getButton(firstText).click();

    await expect(expectFocusTrapped(getRegion())).rejects.toThrow(focusNotMovingMessage);
  });

  test('fails when the container has no focusable elements', async () => {
    await render(<section aria-label={insideText}>{insideText}</section>);

    await expect(expectFocusTrapped(getRegion())).rejects.toThrow(noFocusableElementsMessage);
  });
});

describe('expectEscapeToCloseAndRestoreFocus', () => {
  test('passes when Escape closes the popup and focus returns to the trigger', async () => {
    await render(<DialogWithTrigger />);
    const trigger = getButton(openDialogText);
    const dialog = getDialog();

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

    await expect(expectEscapeToCloseAndRestoreFocus(getDialog(), getButton(openDialogText))).rejects.toThrow(
      removedAssertionPattern
    );
  });

  test('fails when focus is outside the popup', failingCaseTestOptions, async () => {
    await render(
      <>
        <button>{openDialogText}</button>
        <div role="dialog" aria-label={dialogTitleText}>
          <button>{insideButtonText}</button>
        </div>
      </>
    );
    const trigger = getButton(openDialogText);

    await trigger.click();

    await expect(expectEscapeToCloseAndRestoreFocus(getDialog(), trigger)).rejects.toThrow(
      focusOutsideContainerMessage
    );
  });

  test('fails when focus does not return to the trigger', failingCaseTestOptions, async () => {
    await render(<DialogWithoutFocusRestore />);
    const trigger = getButton(openDialogText);
    const dialog = getDialog();

    await trigger.click();
    await expectFocusWithin(dialog);

    await expect(expectEscapeToCloseAndRestoreFocus(dialog, trigger)).rejects.toThrow(focusAssertionPattern);
  });
});

describe('keyboard patterns for MUI components', () => {
  test('dialog takes focus, traps it, closes on Escape and returns focus to the trigger', async () => {
    await render(<DialogWithTrigger />);
    const trigger = getButton(openDialogText);
    const dialog = getDialog();

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
