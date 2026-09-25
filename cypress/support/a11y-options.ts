import type { Options } from 'cypress-axe';

/**
 * Tags gated in CI. WCAG 2.1 AA is what forskrift om universell utforming av IKT
 * requires of us, so these are the rules a violation of which blocks a PR.
 * Under these tags 69 of axe-core's 105 rules run.
 */
export const gatingWcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Impacts gated in CI. Deliberately narrow to begin with: widening this to
 * include 'moderate' surfaces a large wave of heading-order and landmark
 * findings, which is a separate, planned step rather than something to absorb
 * while the mechanism is still bedding in.
 *
 * NOTE: includedImpacts also filters the array handed to the violation callback,
 * so violations below these impacts are neither gated nor logged.
 */
export const gatingImpacts = ['critical', 'serious'];

export const defaultA11yOptions: Options = {
  runOnly: { type: 'tag', values: gatingWcagTags },
  includedImpacts: gatingImpacts,
};

/**
 * Rules that are best-practice rather than WCAG, and so never run under
 * `gatingWcagTags`. Listed here only as documentation of what the sweep does not
 * cover: `page-has-heading-one` and `heading-order` are why `assertSingleH1`
 * exists, and `duplicate-id` is deprecated in axe-core 4.13 (WCAG 2.2 dropped
 * SC 4.1.1), which is why `assertUniqueIds` exists.
 */
export const rulesNotCoveredByGatingTags = [
  'heading-order',
  'page-has-heading-one',
  'landmark-one-main',
  'region',
  'duplicate-id',
  'duplicate-id-active',
];
