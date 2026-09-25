# Accessibility testing

WCAG 2.1 AA is a legal requirement for us under forskrift om universell utforming
av IKT, not an aspiration. This describes what is automated, what is not, and what
to do when a check fails.

## What runs

Cypress drives the real app and runs [axe](https://github.com/dequelabs/axe-core)
against it. Because it is a real browser with real CSS, it catches things a
jsdom-based check cannot — colour contrast above all.

| Spec                                           | Covers                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `cypress/e2e/a11y_public.spec.ts`              | Front page, search, advanced search, public registration landing page, 404, and the route-coverage guard |
| `cypress/e2e/a11y_authenticated.spec.ts`       | Logged-in header, open user menu                                                                         |
| `cypress/e2e/a11y_registration_wizard.spec.ts` | Each wizard tab, plus the validation-error state                                                         |
| `cypress/e2e/search.spec.ts`                   | Paginated and queried search results                                                                     |

All of it runs in the AWS CodeBuild PR check via `npm run test:cypress:ci`.

## Running it locally

```sh
npm run test:cypress:unix   # macOS / Linux
npm run test:cypress        # Windows
```

Both start the app with `VITE_USE_MOCK=true` and run every spec. The mock API is
`src/api/mock-interceptor.ts`, so results are deterministic.

## Adding a check

```ts
cy.checkA11yWithBaseline('some-snapshot-name');
```

Then register `some-snapshot-name` in `cypress/support/a11y-baseline.ts` with an
empty array. An unregistered snapshot fails on purpose, so a new page cannot skip
the sweep by being forgotten.

For a new page, add it to `publicA11yRoutes` in `cypress/support/a11y-routes.ts`
with a `readySelector` that is only visible once the page has its data — that,
not a retry, is what stops axe scanning a loading skeleton.

Note that authenticated pages cannot be reached with `cy.visit`: the mock login
lives only in Redux and does not survive a page load. Navigate through the UI
instead, the way `a11y_registration_wizard.spec.ts` does.

## When a check fails

**"New accessibility violations on ..."** — the change introduced a violation.
Fix it. That is the default and usually the cheapest moment to do it.

If it genuinely cannot be fixed now, add an entry to that snapshot in
`a11y-baseline.ts` with a `reason` and a `ticket` that actually exists. A waiver
without a live ticket should not pass review. Waive per rule, never per DOM node:
MUI and Emotion class names are unstable and node-level waivers go stale fast.

For third-party markup (MUI, Uppy, MathJax), waive the rule and link the upstream
issue in the reason. Prefer that over excluding the subtree from the scan, since
an exclusion also hides any future problem in there.

**"These rules no longer fire on ..."** — something got fixed. Delete the entry.
This is the ratchet: the waiver list can only shrink, and it cannot quietly rot
into a list of things that were fixed years ago.

**"Unknown a11y snapshot ..."** — register it, as above.

**"New routes must be added to ..."** — a route was added to `UrlPathTemplate`
without deciding how it gets checked. Put it in `publicA11yRoutes`, or in
`notYetSweptA11yTemplates` if it is going to wait.

## What is gated

- WCAG 2.1 AA tags only (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) — 69 of
  axe's 105 rules.
- Impact `critical` and `serious` only.

Both are deliberately narrow so the mechanism could be switched on without a red
build. Widening either is a planned step, done one dial at a time so the
resulting findings are attributable. See `cypress/support/a11y-options.ts`.

Note that `includedImpacts` also filters what reaches the log, so `moderate` and
`minor` findings are currently neither gated nor printed.

## What this does not catch

axe finds roughly 30-40% of WCAG problems, and the part it misses is skewed
towards what most affects real users. In particular it cannot see:

- **Focus management.** Whether focus moves sensibly on navigation, is restored
  when a dialog closes, or is ever trapped. This codebase has almost no explicit
  focus handling, so it is the largest known gap.
- **Announcement.** Whether an async result is actually read out. A live region
  can exist and still announce nothing useful.
- **Meaning.** Whether alt text, labels and error messages say anything helpful,
  and whether the reading order makes sense.
- **Rules outside the gated tags**, including `heading-order`,
  `page-has-heading-one`, `landmark-one-main` and `region`, which are classed as
  best-practice rather than WCAG. Note also that axe's `duplicate-id` and
  `duplicate-id-active` rules are deprecated as of 4.13 (WCAG 2.2 dropped SC
  4.1.1), so plain duplicate ids are not reported at all — only
  `duplicate-id-aria`, where an ARIA reference is involved, still is.

These need a manual keyboard and screen-reader pass — NVDA with Firefox, or
VoiceOver with Safari — prioritising the registration wizard and the public
landing page.
