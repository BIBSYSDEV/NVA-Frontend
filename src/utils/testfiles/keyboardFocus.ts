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
export const focusNotMovingMessage = 'Expected Tab to move focus between the elements inside the container';
export const noElementsMessage = 'Expected at least one element to check the tab order of';

/**
 * Presses Tab once per element and waits until focus lands on each of them in the given order.
 * Tabbing starts from the currently focused element, or from the start of the document if nothing has focus.
 */
export const expectTabOrder = async (elements: Locator[]) => {
  expect(elements.length, noElementsMessage).toBeGreaterThan(0);
  for (const element of elements) {
    await userEvent.tab();
    await expect.element(element).toHaveFocus();
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
 * @param backwards Presses Shift+Tab instead of Tab
 * @returns The distinct elements that got focus
 */
const tabThroughContainer = async (container: Locator, tabCount: number, { backwards = false } = {}) => {
  const focusedElements = new Set<Element>();
  for (let step = 0; step < tabCount; step++) {
    await userEvent.tab({ shift: backwards });
    const focusedElement = document.activeElement as HTMLElement | null;
    expect(container.element()).toContainElement(focusedElement);
    if (focusedElement) {
      focusedElements.add(focusedElement);
    }
  }
  return focusedElements;
};

/**
 * Waits until focus is inside the container, then tabs forwards and backwards past every focusable element in it.
 * Checks that focus never leaves the container, and that Tab moves focus when there are several elements to move to.
 * Use it to check the focus trap of a modal dialog.
 */
export const expectFocusTrapped = async (container: Locator) => {
  await expect.element(container).toBeVisible();
  const focusableCount = container.element().querySelectorAll(focusableSelector).length;
  expect(focusableCount, noFocusableElementsMessage).toBeGreaterThan(0);
  await expectFocusWithin(container);

  // NOTE: One extra tab past the last focusable element checks that focus wraps around instead of leaving
  const tabCount = focusableCount + 1;
  const focusedForwards = await tabThroughContainer(container, tabCount);
  const focusedBackwards = await tabThroughContainer(container, tabCount, { backwards: true });

  const hasSeveralFocusableElements = focusableCount > 1;
  if (hasSeveralFocusableElements) {
    expect(focusedForwards.size, focusNotMovingMessage).toBeGreaterThan(1);
    expect(focusedBackwards.size, focusNotMovingMessage).toBeGreaterThan(1);
  }
};

/**
 * Waits until focus is inside the dialog, menu or popover, then presses Escape.
 * Checks that the popup closes, and that focus returns to the element that opened it.
 * @param popup The open dialog, menu or popover
 * @param trigger The element that opened the popup, and that should get focus back
 */
export const expectEscapeToCloseAndRestoreFocus = async (popup: Locator, trigger: Locator) => {
  await expectFocusWithin(popup);
  await userEvent.keyboard('{Escape}');
  await expect.element(popup).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
};
