import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { expectFocusTrapped, expectFocusWithin, expectTabOrder } from './keyboardFocus';

const openDialogText = 'Åpne dialog';
const openMenuText = 'Åpne meny';
const cancelText = 'Avbryt';
const saveText = 'Lagre';
const firstText = 'Første';
const secondText = 'Andre';
const insideText = 'Innhold';
const outsideText = 'Utenfor';

const DialogWithTrigger = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{openDialogText}</Button>
      <Dialog open={open} onClose={close}>
        <DialogTitle>Dialog</DialogTitle>
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

    await expect(expectTabOrder([getButton(firstText), getButton(secondText)])).rejects.toThrow();
  });
});

describe('expectFocusWithin', () => {
  test('fails when focus is outside the container', async () => {
    await render(
      <>
        <button>{outsideText}</button>
        <section aria-label={insideText}>{insideText}</section>
      </>
    );

    await expect(expectFocusWithin(page.getByRole('region'))).rejects.toThrow('Expected focus inside the container');
  });
});

describe('expectFocusTrapped', () => {
  test('fails when focus can leave the container', async () => {
    await render(
      <>
        <section aria-label={insideText}>
          <button>Inni</button>
        </section>
        <button>{outsideText}</button>
      </>
    );

    await expect(expectFocusTrapped(page.getByRole('region'))).rejects.toThrow();
  });
});

describe('keyboard patterns for MUI components', () => {
  test('dialog takes focus, traps it, closes on Escape and returns focus to the trigger', async () => {
    await render(<DialogWithTrigger />);

    await getButton(openDialogText).click();
    const dialog = page.getByRole('dialog');
    await expectFocusWithin(dialog);
    await expectFocusTrapped(dialog);

    await userEvent.keyboard('{Escape}');
    await expect.element(dialog).not.toBeInTheDocument();
    await expect.element(getButton(openDialogText)).toHaveFocus();
  });

  test('menu takes focus, closes on Escape and returns focus to the trigger', async () => {
    await render(<MenuWithTrigger />);

    await getButton(openMenuText).click();
    const menu = page.getByRole('menu');
    await expectFocusWithin(menu);

    await userEvent.keyboard('{Escape}');
    await expect.element(menu).not.toBeInTheDocument();
    await expect.element(getButton(openMenuText)).toHaveFocus();
  });
});
