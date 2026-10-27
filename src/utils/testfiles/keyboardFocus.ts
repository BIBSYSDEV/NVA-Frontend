import { expect } from 'vitest';
import { type Locator, userEvent } from 'vitest/browser';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Presses Tab once per element and checks that focus lands on each of them in the given order.
 * Tabbing starts from the currently focused element, or from the start of the document if nothing has focus.
 */
export const expectTabOrder = async (elements: Locator[]) => {
  for (const element of elements) {
    await userEvent.tab();
    expect(element.element()).toHaveFocus();
  }
};

/**
 * Waits until focus is on the container or an element inside it.
 * Use it to check that focus moves into a dialog or popover when it opens.
 */
export const expectFocusWithin = async (container: Locator) => {
  await expect.element(container).toBeVisible();
  await expect
    .poll(() => container.element().contains(document.activeElement), {
      message: 'Expected focus inside the container',
    })
    .toBe(true);
};

/**
 * Tabs forwards and then backwards past every focusable element in the container, and checks that focus never leaves.
 * Use it to check the focus trap of a modal dialog.
 */
export const expectFocusTrapped = async (container: Locator) => {
  const focusableCount = container.element().querySelectorAll(focusableSelector).length;

  for (const shift of [false, true]) {
    for (let step = 0; step <= focusableCount; step++) {
      await userEvent.tab({ shift });
      expect(container.element()).toContainElement(document.activeElement as HTMLElement | null);
    }
  }
};

/**
 * Presses Escape and checks that the dialog, menu or popover closes, and that focus returns to the element that opened it.
 */
export const expectEscapeToCloseAndRestoreFocus = async (popup: Locator, trigger: Locator) => {
  await userEvent.keyboard('{Escape}');
  await expect.element(popup).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
};
