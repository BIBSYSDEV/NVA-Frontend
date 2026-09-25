export interface WaivedRule {
  /** axe rule id, e.g. 'color-contrast'. */
  rule: string;
  /** Why this is not fixed yet. Written for the next person, not for yourself. */
  reason: string;
  /** Ticket that will delete this entry. Required: a waiver without one is a review blocker. */
  ticket: string;
}

/**
 * Known and accepted accessibility violations, per snapshot.
 *
 * A snapshot must be registered here before it can be checked, with an empty
 * array when there is nothing to waive — an unknown snapshot fails rather than
 * passing silently, so a new page cannot skip the sweep by omission.
 *
 * Entries may only be removed, never loosened: once a waived rule stops firing,
 * the check fails until the entry is deleted. That is what stops this list
 * decaying into a record of things that were fixed years ago.
 *
 * Waivers are per rule, never per DOM node — MUI and Emotion generate unstable
 * class names and ids, so node-level selectors would go stale within a sprint.
 *
 * Populate by running `npm run test:cypress:unix` (or `test:cypress` on Windows)
 * and transcribing the reported violations, one entry per rule, each with a real
 * ticket. See documentation/a11y-testing.md.
 */
export const a11yBaseline: Record<string, WaivedRule[]> = {
  // Global chrome and front page
  frontpage: [
    {
      rule: 'color-contrast',
      reason: 'A MuiButton on the front page does not meet the 4.5:1 text contrast threshold.',
      ticket: 'NP-XXXXX',
    },
  ],
  'not-found': [],
  'header-logged-in': [
    {
      rule: 'color-contrast',
      reason: 'The front page search button behind the header is below the 4.5:1 text threshold.',
      ticket: 'NP-XXXXX',
    },
  ],
  'header-menu-open': [
    {
      rule: 'color-contrast',
      reason: 'The front page search button behind the open menu is below the 4.5:1 text threshold.',
      ticket: 'NP-XXXXX',
    },
  ],

  // Search
  'search-filter': [],
  'search-filter-paginated': [],
  'search-filter-query': [],
  'search-advanced': [
    {
      rule: 'aria-progressbar-name',
      reason: 'The MuiCircularProgress shown while results load has no accessible name.',
      ticket: 'NP-XXXXX',
    },
  ],

  // Public registration landing page
  'registration-landing-page': [],

  // Registration wizard, reached through the UI (see a11y_registration_wizard.spec.ts)
  'registration-wizard-description': [
    {
      rule: 'color-contrast',
      reason: 'The wizard stepper renders its error and completed labels below the 4.5:1 text threshold.',
      ticket: 'NP-XXXXX',
    },
  ],
  'registration-wizard-resource-type': [
    {
      rule: 'color-contrast',
      reason: 'The wizard stepper renders its error and completed labels below the 4.5:1 text threshold.',
      ticket: 'NP-XXXXX',
    },
  ],
  'registration-wizard-contributors': [
    {
      rule: 'color-contrast',
      reason: 'The wizard stepper renders its error and completed labels below the 4.5:1 text threshold.',
      ticket: 'NP-XXXXX',
    },
  ],
  'registration-wizard-files': [
    {
      rule: 'color-contrast',
      reason: 'The wizard stepper renders its error and completed labels below the 4.5:1 text threshold.',
      ticket: 'NP-XXXXX',
    },
  ],
  'registration-wizard-validation-errors': [
    {
      rule: 'color-contrast',
      reason: 'The wizard stepper renders its error and completed labels below the 4.5:1 text threshold.',
      ticket: 'NP-XXXXX',
    },
  ],
};
