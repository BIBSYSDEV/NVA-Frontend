# Nasjonalt Vitenarkiv Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment variables

To run this app, you need to add a set of environment variables to a `.env` file located at the root of the project folder (`/NVA-Frontend/.env`).

A minimal working example for `.env` that uses a simplistic set of (incomplete) mock data looks as follows:

```markdown
REACT_APP_API_HOST=api.dev.nva.aws.unit.no
REACT_APP_USE_MOCK=true
```

Info about all environment variables are listed in the table below. Note that you must be authorized to retrieve some of these values if you don't want to use mock data.

| Name                                   | Example value                                | Description                                                                                                     |
| -------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| REACT_APP_API_HOST                     | `api.dev.nva.aws.unit.no`                    | Required. Base URL to the API. Value can be found by logging in to the Parameter Store in AWS. (/NVA/ApiDomain) |
| REACT_APP_USE_MOCK                     | `false`                                      | Whether to use local mock data or not. If `true`, no more variables are needed.                                 |
| REACT_APP_REDIRECT_SIGN_IN             | `http://localhost:3000`                      | Callback URI for successfull login.                                                                             |
| REACT_APP_REDIRECT_SIGN_OUT            | `http://localhost:3000/logout`               | Callback URI for successfull logout.                                                                            |
| REACT_APP_AWS_USER_POOLS_ID            | `eu-west-1:XXXXXXXXXX`                       | Value can be found by logging in to the Parameter Store in AWS. (CognitoUserPoolId)                             |
| REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID | `XXXXXXXXXX`                                 | Value can be found by logging in to the Parameter Store in AWS. (CognitoUserPoolAppClientId)                    |
| REACT_APP_DOMAIN                       | `XXXXXXXXX.auth.eu-west-1.amazoncognito.com` | Value can be found by logging in to the Parameter Store in AWS. (CognitoAuthenticationDomain)                   |
| REACT_APP_ORCID_BASE_URL               | `https://sandbox.orcid.org`                  | Base URL to ORCID integration.                                                                                  |
| REACT_APP_ORCID_CLIENT_ID              | `APP-XXXXXXXXX`                              | Value can be found by logging in to the Secrets Manager in AWS (OrcidClientID) or ORCID Admin dashboard.        |
| CYPRESS_RECORD_KEY                     | `XXXXXXXXXX`                                 | Value can be found by logging in to the Secrets Manager in AWS (CypressRecordKey) or Cypress Dashboard          |

## Available Scripts

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### Testing

#### `npm run test:cypress`

Runs cypress tests.

Alternatively:

1. Set environment variable in `.env`: `REACT_APP_USE_MOCK=true`
2. `npm start`
3. `npx cypress run` or `npx cypress open`

#### `npm run test:react`

Runs React testing library tests

## Generate code coverage

`npx nyc report`

coverage report: `coverage/lcov-report/index.html`

## External tools

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

[Cypress dashboard](https://dashboard.cypress.io/projects/kigtb6) (requires access) displays details from test runs.

<a title="Lokalise: accelerate localization from code to delivery" href="https://lokalise.com/"><img src="src/resources/images/lokalise_logo.svg?raw=true" alt="Lokalise logo" width="200px"></a><br>

Lokalise allows translating content in a user-friendly web portal. For more information about our preferred workflow when working with translations, see description on [translations.md](documentation/translations/translations.md).

[Socket Security](https://socket.dev/) is used to ensure legitimacy of installed NPM packages for each PR.

## License

Distributed under the MIT license. See [LICENSE](./LICENSE) for details.
