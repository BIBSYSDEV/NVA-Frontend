# Nasjonalt Vitenarkiv Frontend

## Environment variables

To run this app, you need to add a set of environment variables to a `.env` file located at the root of the project folder (`/NVA-Frontend/.env`).

A minimal working example for `.env` that uses a simplistic set of (incomplete) mock data looks as follows:

```markdown
VITE_API_HOST=api.dev.nva.aws.unit.no
VITE_USE_MOCK=true
```

Info about all environment variables are listed in the table below. Note that you must be authorized to retrieve some of these values if you don't want to use mock data.

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
| VITE_MAINTENANCE_MESSAGE          | `<h1>Under maintenance</h1><p>...</p>`       | Information to show users when the service has downtime.                                                       |
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

#### `npm run test:cypress`

Runs cypress tests.

Alternatively:

1. Set environment variable in `.env`: `VITE_USE_MOCK=true`
2. `npm start`
3. `npx cypress run` or `npx cypress open`

## External tools

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

[Cypress dashboard](https://dashboard.cypress.io/projects/kigtb6) (requires access) displays details from test runs.

<a title="Lokalise: accelerate localization from code to delivery" href="https://lokalise.com/"><img src="src/resources/images/lokalise_logo.svg?raw=true" alt="Lokalise logo" width="200px"></a><br>

Lokalise allows translating content in a user-friendly web portal. For more information about our preferred workflow when working with translations, see description on [translations.md](documentation/translations/translations.md).

[Socket Security](https://socket.dev/) is used to ensure legitimacy of installed NPM packages for each PR.

## License

Distributed under the MIT license. See [LICENSE](LICENSE) for details.
