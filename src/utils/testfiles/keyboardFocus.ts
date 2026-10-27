import { expect } from 'vitest';
import { type Locator, userEvent } from 'vitest/browser';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'summary',
].join(', ');

export const focusOutsideContainerMessage = 'Expected focus inside the container';
export const noFocusableElementsMessage = 'Expected focusable elements inside the container';

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
      message: focusOutsideContainerMessage,
    })
    .toBe(true);
};

/**
 * Presses Tab the given number of times, and checks after each press that focus is still inside the container.
 */
const tabThroughContainer = async (container: Locator, tabCount: number, { backwards = false } = {}) => {
  for (let step = 0; step < tabCount; step++) {
    await userEvent.tab({ shift: backwards });
    const focusedElement = document.activeElement as HTMLElement | null;
    expect(container.element()).toContainElement(focusedElement);
  }
};

/**
 * Tabs forwards and then backwards past every focusable element in the container, and checks that focus never leaves.
 * Use it to check the focus trap of a modal dialog.
 */
export const expectFocusTrapped = async (container: Locator) => {
  await expect.element(container).toBeVisible();
  const focusableCount = container.element().querySelectorAll(focusableSelector).length;
  expect(focusableCount, noFocusableElementsMessage).toBeGreaterThan(0);

  // NOTE: One extra tab past the last focusable element checks that focus wraps around instead of leaving
  const tabCount = focusableCount + 1;
  await tabThroughContainer(container, tabCount);
  await tabThroughContainer(container, tabCount, { backwards: true });
};

/**
 * Presses Escape and checks that the dialog, menu or popover closes, and that focus returns to the element that opened it.
 */
export const expectEscapeToCloseAndRestoreFocus = async (popup: Locator, trigger: Locator) => {
  await userEvent.keyboard('{Escape}');
  await expect.element(popup).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
};
