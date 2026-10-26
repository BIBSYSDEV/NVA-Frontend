# Nasjonalt Vitenarkiv Frontend

## Getting started

1. Use Node 24, as pinned in `.nvmrc` and `engines` in `package.json`.
2. Run `npm ci` to install dependencies.
3. Run `npm run prepare` once to install the git hooks (not automatic, see below).

## npm configuration

The committed `.npmrc` locks down npm behavior in this repo, both locally and in CI.
Each setting is explained by a comment in the file.

The most important one is `ignore-scripts=true`, which blocks lifecycle scripts (`preinstall`, `postinstall`, `prepare`)
so a compromised dependency cannot run arbitrary code on install.
It has two consequences:

- Git hooks are not set up on install. Run `npm run prepare` once after cloning.
- The Cypress binary is not downloaded on install. The `test` and `test:cypress:open` scripts handle this by running
  `cypress install` first.
- The Chromium browser used by the browser tests is not downloaded on install. Run `npx playwright install chromium`
  once.

Consider setting `ignore-scripts=true` in your own `~/.npmrc` as well, since the project `.npmrc` only protects installs
in this repo.
Avoid `pre`/`post` script names (like `prebuild`) in `package.json`; npm skips them when `ignore-scripts` is set.

## Environment variables

To run this app, you need to add a set of environment variables to a `.env` file located at the root of the project
folder (`/NVA-Frontend/.env`).

A minimal working example for `.env` that uses a simplistic set of (incomplete) mock data looks as follows:

```markdown
VITE_API_HOST=api.dev.nva.aws.unit.no
VITE_USE_MOCK=true
```

Info about all environment variables are listed in the table below. Note that you must be authorized to retrieve some of
these values if you don't want to use mock data.

| Name                              | Example value                                | Description                                                                                                    |
| --------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| VITE_API_HOST                     | `api.dev.nva.aws.unit.no`                    | Required. Base URL to the API. Value can be found by logging in to the `FRONTEND PROD` account in AWS Amplify. |
| VITE_USE_MOCK                     | `false`                                      | Whether to use local mock data or not. If `true`, no more variables are needed.                                |
| VITE_REDIRECT_SIGN_IN             | `http://localhost:3000`                      | Callback URI for successfull login.                                                                            |
| VITE_REDIRECT_SIGN_OUT            | `http://localhost:3000/logout`               | Callback URI for successfull logout.                                                                           |
| VITE_AWS_USER_POOLS_ID            | `eu-west-1:XXXXXXXXXX`                       | Value can be found by logging in to the `FRONTEND PROD` account in AWS Amplify.                                |
| VITE_AWS_USER_POOLS_WEB_CLIENT_ID | `XXXXXXXXXX`                                 | Value can be found by logging in to the `FRONTEND PROD` account in AWS Amplify.                                |
| VITE_DOMAIN                       | `XXXXXXXXX.auth.eu-west-1.amazoncognito.com` | Value can be found by logging in to the `FRONTEND PROD` account in AWS Amplify.                                |
| VITE_ORCID_BASE_URL               | `https://sandbox.orcid.org`                  | Base URL to ORCID integration.                                                                                 |
| VITE_ORCID_CLIENT_ID              | `APP-XXXXXXXXX`                              | Value can be found by logging in to the `FRONTEND PROD` account in AWS Amplify.                                |
| VITE_MAINTENANCE_MESSAGE_NB       | `<h1>Under vedlikehold</h1><p>...</p>`       | Information in Norwegian to show users when the service has downtime.                                          |
| VITE_MAINTENANCE_MESSAGE_EN       | `<h1>Under maintenance</h1><p>...</p>`       | Information in English to show users when the service has downtime.                                            |
| VITE_MAINTENANCE_SEVERITY         | `block`                                      | Blocks usage of app if `value=block`, otherwise shows the message in banner while app behaves normally         |
| VITE_MAINTENANCE_START            | `2025-01-01T12:00:00.000Z`                   | If supplied, the `VITE_MAINTENANCE_MESSAGE` will not be shown to users before this time (ISO format).          |
| VITE_MAINTENANCE_END              | `2025-01-02T12:00:00.000Z`                   | If supplied, the `VITE_MAINTENANCE_MESSAGE` will not be shown to users after this time (ISO format).           |
| VITE_MATOMO_CONTAINER_URL         | `https://matomo.sikt.no/js/container_XXX`    | Value can be found by logging in to the `FRONTEND PROD` account in AWS Amplify.                                |

## Available Scripts

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### Testing

Tests run with [Vitest](https://vitest.dev/), split into two projects by file name:

- `*.test.ts` runs in Node (`unit` project), for helpers and API functions.
- `*.browser.test.{ts,tsx}` runs in a real Chromium browser through Vitest Browser Mode (`browser` project), for components
  and pages.

Run `npx playwright install chromium` once before running the browser tests. With Node 25, `npm install` fails because
of the `engines` field in `package.json`, so use Node 24.

| Script                         | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `npm run test:vitest`          | Runs all tests in watch mode (once in CI)                  |
| `npm run test:vitest:verbose`  | Runs all tests once, listing each test                     |
| `npm run test:vitest:unit`     | Runs only the `unit` project                               |
| `npm run test:vitest:browser`  | Runs only the `browser` project                            |
| `npm run test:vitest:coverage` | Runs all tests and writes a coverage report to `coverage/` |

When a browser test fails, a screenshot is saved to `.vitest/attachments/`.

Every run logs the warning `Plugin "vitest:mocks:interceptor" defines Vite-specific hooks…`. It comes from Vitest itself
and can be ignored.

#### Accessibility and keyboard tests

Browser tests of components should check accessibility with the helpers in `src/utils/testfiles/`:

- `expectNoA11yViolations(container?, options?)` runs [axe-core](https://github.com/dequelabs/axe-core) with the WCAG
  2.1 A and AA rules, including color contrast, and fails with a list of the violations. It checks the whole document
  unless you pass a container. To turn off a rule for one check, pass `{ rules: { '<rule-id>': { enabled: false } } }`
  and add a comment explaining why.
- `expectTabOrder(elements)` checks that Tab moves focus through the elements in the given order.
- `expectFocusWithin(container)` checks that focus moves into a dialog or popover when it opens.
- `expectFocusTrapped(container)` checks that Tab and Shift+Tab never move focus out of a modal dialog.

To test Escape, press it with `userEvent.keyboard('{Escape}')` from `vitest/browser`, then check that the dialog or
menu is gone and that the trigger has focus again. `src/utils/testfiles/keyboardFocus.browser.test.tsx` shows the full
pattern for an MUI `Dialog` and `Menu`.

#### Cypress

The Cypress tests are being replaced by Vitest browser tests.

- `npm run test:cypress` starts the app in mock mode and runs the Cypress tests.
- Alternatively, set `VITE_USE_MOCK=true` in `.env`, run `npm start`, and then run `npm test` or
  `npm run test:cypress:open`.

## Documentation

Additional documentation lives in the [documentation](documentation) folder:

- [NVI](documentation/NVA-domain-knowledge/NVI.md) — the Norwegian Scientific Index: publication points, author shares
  and how NVI reporting works in NVA
- [Authentication](documentation/authentication.md)
- [Deployment](documentation/deployment/deployment.md)
- [Translations](documentation/translations/translations.md)
- [Application maintenance message](documentation/ApplicationMaintenanceMessage.md)

## External tools

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

[Cypress dashboard](https://dashboard.cypress.io/projects/kigtb6) (requires access) displays details from test runs.

<a title="Lokalise: accelerate localization from code to delivery" href="https://lokalise.com/"><img src="src/resources/images/lokalise_logo.svg?raw=true" alt="Lokalise logo" width="200px"></a><br>

Lokalise allows translating content in a user-friendly web portal. For more information about our preferred workflow
when working with translations, see description on [translations.md](documentation/translations/translations.md).

[Socket Security](https://socket.dev/) is used to ensure legitimacy of installed NPM packages for each PR.

## License

Distributed under the MIT license. See [LICENSE](LICENSE) for details.
